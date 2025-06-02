
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== Credit Payment Function Started ===');
    console.log('Request method:', req.method);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));

    // Get Stripe key
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY not found in environment');
      throw new Error("STRIPE_SECRET_KEY not found");
    }
    console.log('Stripe key found');

    // Get request body with better error handling
    let body;
    let packageId;
    
    try {
      const bodyText = await req.text();
      console.log('Raw body text:', bodyText);
      
      if (!bodyText || bodyText.trim() === '') {
        console.error('Empty request body');
        throw new Error("Empty request body");
      }
      
      body = JSON.parse(bodyText);
      console.log('Parsed body:', body);
      packageId = body.packageId;
      
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Error details:', parseError.message);
      throw new Error(`Failed to parse request body: ${parseError.message}`);
    }

    if (!packageId) {
      console.error('No packageId in request body');
      throw new Error("packageId is required");
    }

    console.log('Package ID:', packageId);

    // Define packages with simpler structure
    const packages = {
      starter: { credits: 500, price: 5 },
      professional: { credits: 1000, price: 9 },
      enterprise: { credits: 2500, price: 20 }
    };

    const selectedPackage = packages[packageId as keyof typeof packages];
    if (!selectedPackage) {
      console.error('Invalid package ID:', packageId);
      throw new Error(`Invalid package: ${packageId}`);
    }

    console.log('Selected package:', selectedPackage);

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });
    console.log('Stripe initialized');

    // Get origin for URLs
    const origin = req.headers.get("origin") || "http://localhost:3000";
    console.log('Origin:', origin);

    // Create checkout session
    console.log('Creating checkout session...');
    const session = await stripe.checkout.sessions.create({
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
      success_url: `${origin}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}&credits=${selectedPackage.credits}`,
      cancel_url: `${origin}/dashboard?payment=cancelled`,
      metadata: {
        package_id: packageId,
        credits: selectedPackage.credits.toString()
      }
    });

    console.log('Checkout session created successfully:', session.id);
    console.log('Session URL:', session.url);

    return new Response(JSON.stringify({ 
      success: true,
      url: session.url,
      sessionId: session.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('=== EDGE FUNCTION ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      details: `Edge function error: ${error.message}`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
