
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard } from 'lucide-react';

const StripeTestButton = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [testCardNumber, setTestCardNumber] = useState('4242 4242 4242 4242');
  const { toast } = useToast();
  const { user } = useAuth();

  const handleTestPayment = async () => {
    console.log('=== STRIPE TEST BUTTON CLICKED ===');
    console.log('User exists:', !!user);
    console.log('Test card number entered:', testCardNumber);
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

    if (!testCardNumber.trim()) {
      toast({
        title: "Test card required",
        description: "Please enter a test card number (e.g., 4242 4242 4242 4242)",
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
      console.log('Use this test card number in Stripe checkout:', testCardNumber);
      
      // Open Stripe checkout in a new tab for testing
      window.open(data.url, '_blank');
      
      toast({
        title: "Test payment initiated",
        description: `Opening Stripe test checkout. Use card: ${testCardNumber}`,
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
    <div className="space-y-3">
      <div>
        <Label htmlFor="testCard" className="text-yellow-300 text-sm">
          Test Card Number
        </Label>
        <Input
          id="testCard"
          value={testCardNumber}
          onChange={(e) => setTestCardNumber(e.target.value)}
          placeholder="4242 4242 4242 4242"
          className="bg-yellow-900/20 border-yellow-500/30 text-yellow-100 placeholder-yellow-400"
        />
        <p className="text-xs text-yellow-400 mt-1">
          Common test cards: 4242 4242 4242 4242 (Visa), 5555 5555 5555 4444 (Mastercard)
        </p>
      </div>
      
      <Button 
        onClick={handleTestPayment}
        disabled={isProcessing}
        className="w-full bg-yellow-600 hover:bg-yellow-700"
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
    </div>
  );
};

export default StripeTestButton;
