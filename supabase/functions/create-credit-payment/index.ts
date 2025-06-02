
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Create payment request received');

    // Check if required environment variables exist
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey || !stripeSecretKey) {
      console.error('Missing required environment variables');
      throw new Error("Server configuration error");
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error('No authorization header provided');
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError) {
      console.error('Auth error:', authError);
      throw new Error("Authentication failed");
    }

    const user = data.user;
    if (!user) {
      console.error('No user found from token');
      throw new Error("User not authenticated");
    }

    console.log('User authenticated:', user.id);

    const requestBody = await req.json();
    const { packageId } = requestBody;
    console.log('Package ID:', packageId);

    if (!packageId) {
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
      throw new Error("Invalid package ID");
    }

    console.log('Selected package:', selectedPackage);

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    let customerId;
    try {
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1
      });

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        console.log('Existing customer found:', customerId);
      } else {
        // Create new customer
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
      throw new Error("Failed to create or find customer");
    }

    // Create checkout session
    console.log('Creating checkout session...');
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
    } catch (stripeError) {
      console.error('Stripe session creation error:', stripeError);
      throw new Error("Failed to create checkout session");
    }

    console.log('Checkout session created:', session.id);

    // Use service role to create purchase record
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey, { 
      auth: { persistSession: false } 
    });

    // Create purchase record
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
        console.error('Error creating purchase record:', purchaseError);
        throw new Error("Failed to create purchase record");
      }

      console.log('Purchase record created:', purchase);
    } catch (dbError) {
      console.error('Database error:', dbError);
      throw new Error("Failed to record purchase");
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    return new Response(JSON.stringify({ 
      error: error.message || "An unexpected error occurred"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
