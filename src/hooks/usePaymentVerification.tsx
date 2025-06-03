
import { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export const usePaymentVerification = () => {
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const credits = urlParams.get('credits');
    const packageName = urlParams.get('package');

    console.log('Payment verification - URL params:', { 
      paymentStatus, 
      credits, 
      packageName 
    });

    if (paymentStatus === 'success') {
      toast({
        title: "Payment Successful!",
        description: `${credits} credits have been added to your account.`,
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
