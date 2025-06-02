
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard } from 'lucide-react';

const StripeTestButton = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleTestPayment = async () => {
    console.log('=== STRIPE TEST BUTTON CLICKED ===');
    console.log('User exists:', !!user);
    console.log('Current URL:', window.location.href);
    console.log('Published domain will be used for success/cancel URLs');

    if (!user) {
      console.error('Authentication missing - User not found');
      toast({
        title: "Authentication required",
        description: "Please sign in to test payments.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      console.log('=== CALLING TEST PAYMENT FUNCTION ===');
      
      const { data, error } = await supabase.functions.invoke('create-credit-payment', {
        body: { packageId: 'starter' },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('=== TEST FUNCTION RESPONSE ===');
      console.log('Response data:', data);
      console.log('Response error:', error);

      if (error) {
        console.error('Function invocation error:', error);
        throw new Error(error.message || 'Failed to create test payment session');
      }

      if (!data || !data.url) {
        console.error('No URL in response data:', data);
        throw new Error('No payment URL received from server.');
      }

      console.log('=== OPENING TEST CHECKOUT ===');
      console.log('Stripe checkout URL:', data.url);
      
      // Open Stripe checkout in a new tab for testing
      window.open(data.url, '_blank');
      
      toast({
        title: "Test payment initiated",
        description: "Opening Stripe test checkout in a new tab...",
      });

    } catch (error) {
      console.error('=== TEST PAYMENT ERROR ===');
      console.error('Error:', error);
      
      toast({
        title: "Test Payment Error",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      onClick={handleTestPayment}
      disabled={isProcessing}
      className="bg-yellow-600 hover:bg-yellow-700"
    >
      {isProcessing ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Testing...
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4 mr-2" />
          Test Stripe Payment
        </>
      )}
    </Button>
  );
};

export default StripeTestButton;
