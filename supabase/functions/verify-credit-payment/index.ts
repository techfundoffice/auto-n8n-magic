
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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { sessionId } = await req.json();

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      throw new Error("Payment not completed");
    }

    // Use service role to update credits and purchase status
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get the purchase record
    const { data: purchase, error: purchaseError } = await supabaseService
      .from("credit_purchases")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (purchaseError || !purchase) {
      throw new Error("Purchase record not found");
    }

    if (purchase.status === 'completed') {
      return new Response(JSON.stringify({ message: "Credits already added" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Update purchase status
    await supabaseService
      .from("credit_purchases")
      .update({ status: "completed" })
      .eq("id", purchase.id);

    // Add credits to user account
    const { data: currentCredits } = await supabaseService
      .from("user_credits")
      .select("credits")
      .eq("user_id", user.id)
      .single();

    const newCreditAmount = (currentCredits?.credits || 0) + purchase.credits;

    await supabaseService
      .from("user_credits")
      .update({ 
        credits: newCreditAmount,
        updated_at: new Date().toISOString() 
      })
      .eq("user_id", user.id);

    return new Response(JSON.stringify({ 
      success: true, 
      creditsAdded: purchase.credits,
      newBalance: newCreditAmount
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
