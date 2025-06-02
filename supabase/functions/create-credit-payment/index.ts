
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
    console.log('=== Simple Credit Payment Function Started ===');

    // Get Stripe key
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("STRIPE_SECRET_KEY not found");
    }

    // Parse request body
    const body = await req.json();
    const { packageId } = body;

    if (!packageId) {
      throw new Error("packageId is required");
    }

    console.log('Package ID:', packageId);

    // Define packages
    const packages = {
      starter: { credits: 500, price: 5 },
      professional: { credits: 1000, price: 9 },
      enterprise: { credits: 2500, price: 20 }
    };

    const selectedPackage = packages[packageId as keyof typeof packages];
    if (!selectedPackage) {
      throw new Error(`Invalid package: ${packageId}`);
    }

    console.log('Selected package:', selectedPackage);

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Create checkout session
    const origin = req.headers.get("origin") || "https://rqhjxaturfnjholigypt.supabase.co";
    
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${selectedPackage.credits} Credits`,
              description: `Credit package for AutoN8n`,
            },
            unit_amount: selectedPackage.price * 100,
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

    console.log('Checkout session created:', session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error:', error.message);
    
    return new Response(JSON.stringify({ 
      error: error.message
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
