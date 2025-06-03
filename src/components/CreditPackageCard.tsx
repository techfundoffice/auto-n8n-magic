
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard } from 'lucide-react';
import { CreditPackage } from '@/types/creditPackage';

interface CreditPackageCardProps {
  pkg: CreditPackage;
  isProcessing: boolean;
  onPurchase: (pkg: CreditPackage) => void;
}

const CreditPackageCard = ({ pkg, isProcessing, onPurchase }: CreditPackageCardProps) => {
  return (
    <Card 
      className={`relative bg-gray-900/50 border-gray-600 hover:border-blue-500 transition-colors cursor-pointer ${
        pkg.popular ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onPurchase(pkg)}
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
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Opening...
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
  );
};

export default CreditPackageCard;
