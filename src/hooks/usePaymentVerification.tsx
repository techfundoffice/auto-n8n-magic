
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const usePaymentVerification = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const sessionId = urlParams.get('session_id');
    const credits = urlParams.get('credits');

    console.log('Payment verification - URL params:', { 
      paymentStatus, 
      sessionId, 
      credits,
      fullUrl: window.location.href,
      search: window.location.search 
    });

    if (paymentStatus === 'success' && user) {
      if (sessionId) {
        console.log('Starting payment verification for session:', sessionId);
        verifyPayment(sessionId, credits);
      } else {
        console.error('Payment success but no session_id found in URL params');
        console.error('Available URL params:', Array.from(urlParams.entries()));
        toast({
          title: "Payment Verification Error",
          description: "Missing session information. Please contact support if credits weren't added.",
          variant: "destructive"
        });
        // Clean up URL anyway
        window.history.replaceState({}, '', window.location.pathname);
      }
    } else if (paymentStatus === 'cancelled') {
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled. No charges were made.",
        variant: "destructive"
      });
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [user, toast]);

  const verifyPayment = async (sessionId: string, credits: string | null) => {
    try {
      console.log('About to call verify-credit-payment function with sessionId:', sessionId);
      console.log('User auth token exists:', !!user);
      
      // Get fresh session for verification
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error during verification:', sessionError);
        throw new Error(`Session error: ${sessionError.message}`);
      }

      if (!session?.access_token) {
        console.error('No valid session for verification');
        throw new Error('Authentication required for payment verification');
      }
      
      const { data, error } = await supabase.functions.invoke('verify-credit-payment', {
        body: JSON.stringify({ sessionId }),
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Verification response received:', { data, error });

      if (error) {
        console.error('Payment verification error:', error);
        toast({
          title: "Payment Verification Failed",
          description: "Please contact support if credits weren't added to your account.",
          variant: "destructive"
        });
        return;
      }

      if (data?.success) {
        console.log('Payment verified successfully, credits added:', data.creditsAdded);
        toast({
          title: "Payment Successful!",
          description: `${data.creditsAdded} credits have been added to your account.`,
        });
        
        // Force a refresh of the credits data
        window.dispatchEvent(new CustomEvent('creditsUpdated'));
      } else {
        console.log('Payment verification returned non-success:', data);
        toast({
          title: "Payment Processing",
          description: data?.message || "Payment is being processed. Credits will be added shortly.",
        });
      }

    } catch (error) {
      console.error('Error calling verify-credit-payment function:', error);
      toast({
        title: "Verification Error",
        description: "Please contact support if credits weren't added to your account.",
        variant: "destructive"
      });
    } finally {
      // Clean up URL parameters
      console.log('Cleaning up URL parameters');
      window.history.replaceState({}, '', window.location.pathname);
    }
  };
};
