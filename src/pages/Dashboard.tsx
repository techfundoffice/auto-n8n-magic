
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { usePaymentVerification } from '@/hooks/usePaymentVerification';
import { Plus, Zap, TestTube } from 'lucide-react';
import CreateWorkflowModal from '@/components/CreateWorkflowModal';
import CreditPurchaseButton from '@/components/CreditPurchaseButton';
import TestSuiteButton from '@/components/TestSuiteButton';
import UserMenu from '@/components/UserMenu';
import Chatbot from '@/components/Chatbot';

const Dashboard = () => {
  const { user } = useAuth();
  const { credits, loading: creditsLoading } = useCredits();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Initialize payment verification
  usePaymentVerification();

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
              <h1 className="text-2xl font-bold text-white">AutoN8n Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-white font-medium">{credits} credits</span>
              </div>
              <CreditPurchaseButton />
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Add the test button near the top */}
          <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <h3 className="text-yellow-400 font-semibold mb-2">Stripe Payment Testing</h3>
            <p className="text-yellow-300 text-sm mb-3">
              Test the Stripe payment integration using the published domain. This will work with real Stripe checkout.
            </p>
            <StripeTestButton />
          </div>

          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.user_metadata?.full_name || user?.email}!
            </h2>
            <p className="text-gray-300">
              Create, enhance, and manage your n8n workflows with AI assistance.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-blue-500" />
                  Create Workflow
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Generate new n8n workflows using AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Start Creating
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-purple-500" />
                  AI Assistant
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Chat with AI to enhance workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setIsChatbotOpen(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Open Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TestTube className="w-5 h-5 mr-2 text-green-500" />
                  Test Suite
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Test all features and functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TestSuiteButton />
              </CardContent>
            </Card>
          </div>

          {/* Credits Section */}
          <Card className="bg-gray-800/50 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Credit Balance</CardTitle>
              <CardDescription className="text-gray-300">
                Your current credit balance and usage information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-yellow-500/10 px-4 py-2 rounded-lg border border-yellow-500/20">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="text-yellow-400 font-bold text-lg">{credits} Credits</span>
                  </div>
                  <div className="text-gray-300 text-sm">
                    • Workflow Generation: 15 credits<br />
                    • Workflow Enhancement: 10 credits<br />
                    • Workflow Creation: 10 credits
                  </div>
                </div>
                <CreditPurchaseButton />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <CreateWorkflowModal 
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      {/* Chatbot */}
      <Chatbot 
        isOpen={isChatbotOpen} 
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)} 
      />
    </div>
  );
};

export default Dashboard;
