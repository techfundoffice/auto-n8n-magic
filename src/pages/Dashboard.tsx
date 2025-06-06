
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { usePaymentVerification } from '@/hooks/usePaymentVerification';
import { Plus, Zap, TestTube, Activity, TrendingUp, Clock } from 'lucide-react';
import CreateWorkflowModal from '@/components/CreateWorkflowModal';
import TestSuiteButton from '@/components/TestSuiteButton';
import Chatbot from '@/components/Chatbot';
import SidebarLayout from '@/components/layout/SidebarLayout';

const Dashboard = () => {
  const { user } = useAuth();
  const { credits, loading: creditsLoading } = useCredits();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Initialize payment verification
  usePaymentVerification();

  if (creditsLoading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.user_metadata?.full_name || user?.email}!
          </h1>
          <p className="text-gray-300">
            Create, enhance, and manage your n8n workflows with AI assistance.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-white">{credits}</p>
                  <p className="text-gray-400 text-sm">Credits Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-white">12</p>
                  <p className="text-gray-400 text-sm">Active Workflows</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-white">247</p>
                  <p className="text-gray-400 text-sm">Executions Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold text-white">98.5%</p>
                  <p className="text-gray-400 text-sm">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
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

        {/* Credits Information */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Credit Usage</CardTitle>
            <CardDescription className="text-gray-300">
              Your current credit balance and usage information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-gray-300 text-sm space-y-1">
              <p>• Workflow Generation: 15 credits</p>
              <p>• Workflow Enhancement: 10 credits</p>
              <p>• Workflow Creation: 10 credits</p>
            </div>
          </CardContent>
        </Card>
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
    </SidebarLayout>
  );
};

export default Dashboard;
