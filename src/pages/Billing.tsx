
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCredits } from '@/hooks/useCredits';
import { Zap, CreditCard, History } from 'lucide-react';
import CreditPurchaseButton from '@/components/CreditPurchaseButton';

const Billing = () => {
  const { credits } = useCredits();

  return (
    <SidebarLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Billing & Credits</h1>
          <p className="text-gray-400">
            Manage your credits and billing information
          </p>
        </div>

        <div className="space-y-6">
          {/* Current Credits */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Current Balance
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your available credits for AI operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-yellow-500/10 px-4 py-2 rounded-lg border border-yellow-500/20">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="text-yellow-400 font-bold text-lg">{credits} Credits</span>
                  </div>
                </div>
                <CreditPurchaseButton />
              </div>
            </CardContent>
          </Card>

          {/* Credit Usage */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <History className="w-5 h-5 mr-2 text-blue-500" />
                Credit Usage
              </CardTitle>
              <CardDescription className="text-gray-300">
                Breakdown of credit costs for different operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Workflow Generation</span>
                  <span className="text-white font-medium">15 credits</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Workflow Enhancement</span>
                  <span className="text-white font-medium">10 credits</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Workflow Creation</span>
                  <span className="text-white font-medium">10 credits</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Information */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-green-500" />
                Billing Information
              </CardTitle>
              <CardDescription className="text-gray-300">
                Manage your payment methods and billing details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No payment methods on file</p>
                <p className="text-sm text-gray-500">Add a payment method to purchase credits automatically</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Billing;
