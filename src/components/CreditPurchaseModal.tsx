import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Zap, Star, Crown } from 'lucide-react';

interface CreditPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchaseSuccess?: () => void;
}

interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  name: string;
  description: string;
  popular?: boolean;
  icon: React.ReactNode;
}

const creditPackages: CreditPackage[] = [
  {
    id: 'starter',
    credits: 500,
    price: 5,
    name: 'Starter',
    description: 'Perfect for trying out AutoN8n',
    icon: <Zap className="w-6 h-6" />
  },
  {
    id: 'professional',
    credits: 1000,
    price: 9,
    name: 'Professional',
    description: 'Best value for regular users',
    popular: true,
    icon: <Star className="w-6 h-6" />
  },
  {
    id: 'enterprise',
    credits: 2500,
    price: 20,
    name: 'Enterprise',
    description: 'For heavy automation users',
    icon: <Crown className="w-6 h-6" />
  }
];

const CreditPurchaseModal = ({ open, onOpenChange, onPurchaseSuccess }: CreditPurchaseModalProps) => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePurchase = async (packageId: string) => {
    console.log('=== PURCHASE FLOW STARTED ===');
    console.log('Package ID:', packageId);
    console.log('User exists:', !!user);

    if (!user) {
      console.error('Authentication missing - User not found');
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase credits.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setSelectedPackage(packageId);

    try {
      console.log('=== CALLING SUPABASE FUNCTION ===');
      
      const requestBody = { packageId };
      console.log('Request body:', requestBody);
      
      // Call the edge function with explicit JSON body
      const { data, error } = await supabase.functions.invoke('create-credit-payment', {
        body: requestBody,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('=== FUNCTION RESPONSE ===');
      console.log('Response data:', data);
      console.log('Response error:', error);

      if (error) {
        console.error('Function invocation error:', error);
        throw new Error(error.message || 'Failed to create payment session');
      }

      if (!data) {
        console.error('No data returned from function');
        throw new Error('No response received from payment service.');
      }

      if (!data.url) {
        console.error('No URL in response data:', data);
        throw new Error('No payment URL received from server.');
      }

      console.log('=== OPENING CHECKOUT ===');
      console.log('Stripe checkout URL:', data.url);
      
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      toast({
        title: "Redirecting to payment",
        description: "Opening Stripe checkout in a new tab...",
      });

    } catch (error) {
      console.error('=== PURCHASE ERROR ===');
      console.error('Error:', error);
      
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setSelectedPackage(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Purchase Credits
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose a credit package to continue using AutoN8n's AI features
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4 py-6">
          {creditPackages.map((pkg) => (
            <Card 
              key={pkg.id}
              className={`relative bg-gray-900/50 border-gray-600 hover:border-blue-500 transition-colors cursor-pointer ${
                pkg.popular ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handlePurchase(pkg.id)}
            >
              {pkg.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 text-blue-400">
                  {pkg.icon}
                </div>
                <CardTitle className="text-white">{pkg.name}</CardTitle>
                <CardDescription className="text-gray-400">
                  {pkg.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center">
                <div className="mb-4">
                  <div className="text-3xl font-bold text-white">${pkg.price}</div>
                  <div className="text-gray-400">
                    {pkg.credits.toLocaleString()} credits
                  </div>
                  <div className="text-sm text-gray-500">
                    ${(pkg.price / pkg.credits * 1000).toFixed(2)} per 1000 credits
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isProcessing && selectedPackage === pkg.id}
                >
                  {isProcessing && selectedPackage === pkg.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Purchase
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Secure payment powered by Stripe</p>
          <p>Credits are added instantly after successful payment</p>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreditPurchaseModal;
