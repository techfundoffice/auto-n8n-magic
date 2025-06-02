
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

    if (paymentStatus === 'success' && sessionId && user) {
      verifyPayment(sessionId, credits);
    } else if (paymentStatus === 'cancelled') {
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled. No charges were made.",
        variant: "destructive"
      });
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [user]);

  const verifyPayment = async (sessionId: string, credits: string | null) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-credit-payment', {
        body: { sessionId }
      });

      if (error) {
        console.error('Payment verification error:', error);
        toast({
          title: "Payment Verification Failed",
          description: "Please contact support if credits weren't added to your account.",
          variant: "destructive"
        });
        return;
      }

      if (data.success) {
        toast({
          title: "Payment Successful!",
          description: `${data.creditsAdded} credits have been added to your account.`,
        });
      }

    } catch (error) {
      console.error('Error verifying payment:', error);
      toast({
        title: "Verification Error",
        description: "Please contact support if credits weren't added to your account.",
        variant: "destructive"
      });
    } finally {
      // Clean up URL parameters
      window.history.replaceState({}, '', window.location.pathname);
    }
  };
};
