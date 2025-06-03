
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { CreditCard } from 'lucide-react';
import { creditPackages } from '@/data/creditPackages';
import { CreditPackage } from '@/types/creditPackage';
import CreditPackageCard from './CreditPackageCard';
import PaymentFooter from './PaymentFooter';

interface CreditPurchaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchaseSuccess?: () => void;
}

const CreditPurchaseModal = ({ open, onOpenChange, onPurchaseSuccess }: CreditPurchaseModalProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePurchase = async (pkg: CreditPackage) => {
    console.log('=== PAYMENT LINK REDIRECT STARTED ===');
    console.log('Package:', pkg.name, 'Credits:', pkg.credits);
    console.log('Payment Link:', pkg.paymentLink);

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

    try {
      console.log('=== OPENING STRIPE PAYMENT LINK ===');
      
      // Check if the payment link is properly configured
      if (pkg.paymentLink.includes('replace_with_actual_link')) {
        throw new Error('Payment link not configured. Please set up Stripe Payment Links first.');
      }
      
      // Open Stripe Payment Link in a new tab
      window.open(pkg.paymentLink, '_blank');
      
      toast({
        title: "Redirecting to payment",
        description: "Opening Stripe checkout in a new tab...",
      });

      // Close modal after short delay since payment opens in new tab
      setTimeout(() => {
        onOpenChange(false);
      }, 1000);

    } catch (error) {
      console.error('=== PAYMENT LINK ERROR ===');
      console.error('Error:', error);
      
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
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
            <CreditPackageCard
              key={pkg.id}
              pkg={pkg}
              isProcessing={isProcessing}
              onPurchase={handlePurchase}
            />
          ))}
        </div>

        <PaymentFooter />

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
