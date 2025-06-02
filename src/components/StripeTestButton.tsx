
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const StripeTestButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const testPayment = async () => {
    console.log('=== FRONTEND TEST STARTED ===');
    setIsLoading(true);

    try {
      const payload = { packageId: 'starter' };
      console.log('Sending payload:', payload);
      console.log('Payload JSON string:', JSON.stringify(payload));

      const { data, error } = await supabase.functions.invoke('create-credit-payment', {
        body: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('=== RESPONSE RECEIVED ===');
      console.log('Data:', data);
      console.log('Error:', error);

      if (error) {
        console.error('Supabase function error:', error);
        toast({
          title: "Error",
          description: `Function error: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      if (!data) {
        console.error('No data returned');
        toast({
          title: "Error", 
          description: "No response from payment service",
          variant: "destructive"
        });
        return;
      }

      if (data.success && data.url) {
        console.log('Opening Stripe checkout:', data.url);
        window.open(data.url, '_blank');
        toast({
          title: "Success",
          description: "Opening Stripe checkout...",
        });
      } else {
        console.error('Invalid response:', data);
        toast({
          title: "Error",
          description: data.error || "Invalid response from server",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('=== FRONTEND ERROR ===');
      console.error('Error:', error);
      toast({
        title: "Error",
        description: `Frontend error: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Stripe Payment Test</h3>
      <p className="text-sm text-gray-600 mb-4">
        This will test the Stripe payment flow with detailed logging.
        Check the browser console and edge function logs.
      </p>
      <Button 
        onClick={testPayment}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Testing...' : 'Test Stripe Payment'}
      </Button>
    </div>
  );
};

export default StripeTestButton;
