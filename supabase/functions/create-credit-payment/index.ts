
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log('=== Create Credit Payment Function Started ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);

  if (req.method === "OPTIONS") {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing payment request...');

    // Check environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

    console.log('Environment check:', {
      supabaseUrl: !!supabaseUrl,
      supabaseAnonKey: !!supabaseAnonKey,
      supabaseServiceKey: !!supabaseServiceKey,
      stripeSecretKey: !!stripeSecretKey
    });

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey || !stripeSecretKey) {
      console.error('Missing environment variables:', {
        supabaseUrl: !supabaseUrl,
        supabaseAnonKey: !supabaseAnonKey,
        supabaseServiceKey: !supabaseServiceKey,
        stripeSecretKey: !stripeSecretKey
      });
      throw new Error("Server configuration error - missing environment variables");
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    console.log('Authorization header present:', !!authHeader);
    
    if (!authHeader) {
      console.error('No authorization header provided');
      throw new Error("Authentication required - no authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    console.log('Extracting user from token...');
    
    const { data, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError) {
      console.error('Authentication error:', authError);
      throw new Error(`Authentication failed: ${authError.message}`);
    }

    const user = data.user;
    if (!user) {
      console.error('No user found from token');
      throw new Error("User not authenticated");
    }

    console.log('User authenticated successfully:', {
      id: user.id,
      email: user.email
    });

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Request body parsed:', requestBody);
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      throw new Error("Invalid request body");
    }

    const { packageId } = requestBody;
    console.log('Package ID received:', packageId);

    if (!packageId) {
      console.error('Package ID missing from request');
      throw new Error("Package ID is required");
    }

    // Define credit packages
    const packages = {
      starter: { credits: 500, price: 5 },
      professional: { credits: 1000, price: 9 },
      enterprise: { credits: 2500, price: 20 }
    };

    const selectedPackage = packages[packageId as keyof typeof packages];
    if (!selectedPackage) {
      console.error('Invalid package ID:', packageId);
      throw new Error(`Invalid package ID: ${packageId}`);
    }

    console.log('Selected package:', selectedPackage);

    // Initialize Stripe
    console.log('Initializing Stripe...');
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    let customerId;
    try {
      console.log('Checking for existing Stripe customer...');
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1
      });

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        console.log('Existing customer found:', customerId);
      } else {
        console.log('Creating new Stripe customer...');
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            user_id: user.id
          }
        });
        customerId = customer.id;
        console.log('New customer created:', customerId);
      }
    } catch (stripeError) {
      console.error('Stripe customer error:', stripeError);
      throw new Error(`Failed to handle Stripe customer: ${stripeError.message}`);
    }

    // Create checkout session
    console.log('Creating Stripe checkout session...');
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${selectedPackage.credits} Credits`,
                description: `Credit package for AutoN8n`,
              },
              unit_amount: selectedPackage.price * 100, // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.get("origin")}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}&credits=${selectedPackage.credits}`,
        cancel_url: `${req.headers.get("origin")}/dashboard?payment=cancelled`,
        metadata: {
          user_id: user.id,
          package_id: packageId,
          credits: selectedPackage.credits.toString()
        }
      });
      
      console.log('Checkout session created successfully:', {
        sessionId: session.id,
        url: session.url
      });
    } catch (stripeError) {
      console.error('Stripe session creation error:', stripeError);
      throw new Error(`Failed to create checkout session: ${stripeError.message}`);
    }

    // Use service role to create purchase record
    console.log('Creating purchase record in database...');
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey, { 
      auth: { persistSession: false } 
    });

    try {
      const { data: purchase, error: purchaseError } = await supabaseService
        .from("credit_purchases")
        .insert({
          user_id: user.id,
          stripe_session_id: session.id,
          package_id: packageId,
          credits: selectedPackage.credits,
          amount: selectedPackage.price,
          status: 'pending'
        })
        .select()
        .single();

      if (purchaseError) {
        console.error('Database error creating purchase record:', purchaseError);
        throw new Error(`Failed to create purchase record: ${purchaseError.message}`);
      }

      console.log('Purchase record created successfully:', purchase);
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log('=== Payment session created successfully ===');
    console.log('Returning checkout URL to client');

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('=== Create Credit Payment Function Error ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: error.message || "An unexpected error occurred",
      details: error.stack || "No stack trace available"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
