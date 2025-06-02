
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { supabase } from '@/integrations/supabase/client';
import { CreditCard, Plus, Settings, History, ExternalLink, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import UserMenu from '@/components/UserMenu';
import CreditPurchaseButton from '@/components/CreditPurchaseButton';

const Billing = () => {
  const { user } = useAuth();
  const { credits, loading: creditsLoading } = useCredits();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleManagePaymentMethods = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to manage payment methods.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('=== OPENING CUSTOMER PORTAL ===');
      console.log('User:', user.email);

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Customer portal response:', data, error);

      if (error) {
        console.error('Customer portal error:', error);
        throw new Error(error.message || 'Failed to open customer portal');
      }

      if (!data) {
        throw new Error('No response data received from server.');
      }

      // Handle configuration required error
      if (data.configurationRequired) {
        toast({
          title: "Setup Required",
          description: "Please configure your Stripe Customer Portal first. Check the setup instructions below.",
          variant: "destructive"
        });
        return;
      }

      if (!data.url) {
        console.error('No URL in response data:', data);
        throw new Error('No portal URL received from server.');
      }

      console.log('Opening customer portal:', data.url);
      
      // Open Stripe Customer Portal in a new tab
      window.open(data.url, '_blank');
      
      toast({
        title: "Customer Portal opened",
        description: "Manage your payment methods and billing history in the new tab.",
      });

    } catch (error) {
      console.error('Customer portal error:', error);
      
      toast({
        title: "Error opening customer portal",
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (creditsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-gray-800/50"
                onClick={() => window.history.back()}
              >
                ← Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-white">Billing & Credits</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                <CreditCard className="w-4 h-4 text-yellow-500" />
                <span className="text-white font-medium">{credits} credits</span>
              </div>
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Current Credit Balance */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-yellow-500" />
                Current Balance
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your available credits for AutoN8n services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-yellow-500/10 px-6 py-3 rounded-lg border border-yellow-500/20">
                    <CreditCard className="w-6 h-6 text-yellow-500" />
                    <span className="text-yellow-400 font-bold text-2xl">{credits}</span>
                    <span className="text-yellow-400 text-lg">Credits</span>
                  </div>
                  <div className="text-gray-300 text-sm">
                    <div>• Workflow Generation: 15 credits</div>
                    <div>• Workflow Enhancement: 10 credits</div>
                    <div>• Workflow Creation: 10 credits</div>
                  </div>
                </div>
                <CreditPurchaseButton />
              </div>
            </CardContent>
          </Card>

          {/* Stripe Setup Notice */}
          <Card className="bg-orange-900/20 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-orange-300 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Stripe Customer Portal Setup Required
              </CardTitle>
              <CardDescription className="text-orange-200">
                To manage payment methods, you need to configure Stripe Customer Portal first
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-orange-100 text-sm space-y-2">
                <p className="font-medium">Setup Steps:</p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Go to your Stripe Dashboard</li>
                  <li>Navigate to Settings → Customer Portal</li>
                  <li>Configure your portal settings and activate it</li>
                  <li>Return here to manage your payment methods</li>
                </ol>
              </div>
              <Button 
                variant="outline" 
                className="border-orange-500 text-orange-300 hover:bg-orange-500/10"
                onClick={() => window.open('https://dashboard.stripe.com/settings/billing/portal', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Stripe Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* Payment Methods Management */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-500" />
                Payment Methods
              </CardTitle>
              <CardDescription className="text-gray-300">
                Manage your saved payment methods and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Manage Payment Methods</p>
                    <p className="text-gray-400 text-sm">Add, remove, or update your payment methods</p>
                  </div>
                </div>
                <Button 
                  onClick={handleManagePaymentMethods}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Opening...
                    </>
                  ) : (
                    <>
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </>
                  )}
                </Button>
              </div>
              
              <div className="text-gray-400 text-sm p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <p className="font-medium text-blue-300 mb-2">Secure Payment Processing</p>
                <p>
                  All payment information is securely processed and stored by Stripe. 
                  We never store your credit card details on our servers.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Billing History */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <History className="w-5 h-5 mr-2 text-green-500" />
                Billing History
              </CardTitle>
              <CardDescription className="text-gray-300">
                View your past purchases and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 bg-gray-700/30 rounded-lg border border-gray-600/50">
                <div className="text-center">
                  <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-white font-medium mb-2">View Complete Billing History</p>
                  <p className="text-gray-400 text-sm mb-4">
                    Access detailed invoices, receipts, and transaction history through your customer portal
                  </p>
                  <Button 
                    onClick={handleManagePaymentMethods}
                    disabled={isLoading}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <History className="w-4 h-4 mr-2" />
                    View History
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Billing;
