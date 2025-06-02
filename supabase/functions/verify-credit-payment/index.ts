
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
    console.log('Verify payment request received');

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    console.log('User authenticated:', user.id);

    const { sessionId } = await req.json();
    console.log('Session ID:', sessionId);

    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the session
    console.log('Retrieving Stripe session...');
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Stripe session status:', session.payment_status);

    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Payment not completed yet" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Use service role to update credits and purchase status
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    console.log('Looking for purchase record...');
    
    // Get the purchase record
    const { data: purchase, error: purchaseError } = await supabaseService
      .from("credit_purchases")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (purchaseError) {
      console.error('Purchase lookup error:', purchaseError);
      
      // If no purchase record exists, try to create one from the session metadata
      if (purchaseError.code === 'PGRST116') {
        console.log('No purchase record found, creating from session data...');
        
        // Determine credits based on session amount
        const amount = session.amount_total ? session.amount_total / 100 : 0;
        let credits = 0;
        let packageId = '';
        
        if (amount === 5) {
          credits = 500;
          packageId = 'starter';
        } else if (amount === 9) {
          credits = 1000;
          packageId = 'professional';
        } else if (amount === 20) {
          credits = 2500;
          packageId = 'enterprise';
        }
        
        if (credits > 0) {
          const { data: newPurchase, error: createError } = await supabaseService
            .from("credit_purchases")
            .insert({
              user_id: user.id,
              stripe_session_id: sessionId,
              package_id: packageId,
              credits: credits,
              amount: amount,
              status: 'completed'
            })
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating purchase record:', createError);
            throw new Error("Failed to create purchase record");
          }
          
          console.log('Created purchase record:', newPurchase);
          
          // Add credits to user account
          await addCreditsToUser(supabaseService, user.id, credits);
          
          return new Response(JSON.stringify({ 
            success: true, 
            creditsAdded: credits,
            message: "Credits added successfully"
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }
      }
      
      throw new Error("Purchase record not found and could not be created");
    }

    console.log('Found purchase record:', purchase);

    if (purchase.status === 'completed') {
      console.log('Purchase already processed');
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Credits already added",
        creditsAdded: purchase.credits
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Update purchase status
    console.log('Updating purchase status to completed...');
    await supabaseService
      .from("credit_purchases")
      .update({ status: "completed" })
      .eq("id", purchase.id);

    // Add credits to user account
    await addCreditsToUser(supabaseService, user.id, purchase.credits);

    console.log('Payment verification completed successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      creditsAdded: purchase.credits,
      message: "Credits added successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function addCreditsToUser(supabaseService: any, userId: string, creditsToAdd: number) {
  console.log(`Adding ${creditsToAdd} credits to user ${userId}`);
  
  // Get current credits
  const { data: currentCredits, error: fetchError } = await supabaseService
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .single();

  if (fetchError && fetchError.code === 'PGRST116') {
    // Create new credits record
    console.log('Creating new credits record...');
    const { error: insertError } = await supabaseService
      .from("user_credits")
      .insert({ 
        user_id: userId, 
        credits: 1250 + creditsToAdd,
        updated_at: new Date().toISOString() 
      });
      
    if (insertError) {
      console.error('Error creating credits record:', insertError);
      throw new Error("Failed to create credits record");
    }
  } else if (fetchError) {
    console.error('Error fetching current credits:', fetchError);
    throw new Error("Failed to fetch current credits");
  } else {
    // Update existing credits
    const newCreditAmount = (currentCredits?.credits || 0) + creditsToAdd;
    console.log(`Updating credits from ${currentCredits?.credits} to ${newCreditAmount}`);
    
    const { error: updateError } = await supabaseService
      .from("user_credits")
      .update({ 
        credits: newCreditAmount,
        updated_at: new Date().toISOString() 
      })
      .eq("user_id", userId);
      
    if (updateError) {
      console.error('Error updating credits:', updateError);
      throw new Error("Failed to update credits");
    }
  }
  
  console.log('Credits updated successfully');
}
