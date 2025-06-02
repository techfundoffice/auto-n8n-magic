
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard } from 'lucide-react';
import CreditPurchaseModal from './CreditPurchaseModal';

const CreditPurchaseButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
      >
        <CreditCard className="w-4 h-4 mr-2" />
        Buy Credits
      </Button>
      
      <CreditPurchaseModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        onPurchaseSuccess={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CreditPurchaseButton;
