
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export const usePaymentVerification = () => {
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const sessionId = urlParams.get('session_id');
    const credits = urlParams.get('credits');

    console.log('Payment verification - URL params:', { 
      paymentStatus, 
      sessionId, 
      credits 
    });

    if (paymentStatus === 'success') {
      toast({
        title: "Payment Successful!",
        description: `${credits} credits will be added to your account.`,
      });
      
      // Force a refresh of the credits data
      window.dispatchEvent(new CustomEvent('creditsUpdated'));
      
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (paymentStatus === 'cancelled') {
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled. No charges were made.",
        variant: "destructive"
      });
      
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [toast]);
};
