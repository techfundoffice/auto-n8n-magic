
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

        {/* Credential Bridge Section */}
        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              🔐 Credential Bridge Dashboard
            </CardTitle>
            <CardDescription className="text-gray-300">
              Managing 525 credentials between Infisical and N8N
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Status Bar */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-white font-semibold">Infisical Connection</p>
                  <p className="text-gray-400 text-sm">Last sync: 2 minutes ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-white font-semibold">N8N Bridge</p>
                  <p className="text-gray-400 text-sm">Bridge running on :3001</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-white font-semibold">Sync Status</p>
                  <p className="text-gray-400 text-sm">3 credentials pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Bridge Content */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">📋 Infisical Credentials (525)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">openrouter_api_key</div>
                    <div className="text-gray-400 text-sm">API Key</div>
                  </div>
                  <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">✓ Synced</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">openai_gpt4_key</div>
                    <div className="text-gray-400 text-sm">OpenAI API</div>
                  </div>
                  <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">✓ Synced</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">anthropic_claude_key</div>
                    <div className="text-gray-400 text-sm">Anthropic API</div>
                  </div>
                  <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded text-xs">⏳ Pending</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">apify_automation_token</div>
                    <div className="text-gray-400 text-sm">Apify API</div>
                  </div>
                  <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">✓ Synced</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">wordpress_admin_pass</div>
                    <div className="text-gray-400 text-sm">Basic Auth</div>
                  </div>
                  <span className="px-2 py-1 bg-red-600/20 text-red-400 rounded text-xs">❌ Error</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">🎯 N8N Credential Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-3 items-center gap-4 p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300 text-sm">openrouter_api_key</span>
                  <span className="text-gray-400 text-center">→</span>
                  <span className="text-blue-400 text-sm">httpHeaderAuth</span>
                </div>
                
                <div className="grid grid-cols-3 items-center gap-4 p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300 text-sm">openai_gpt4_key</span>
                  <span className="text-gray-400 text-center">→</span>
                  <span className="text-blue-400 text-sm">openAiApi</span>
                </div>
                
                <div className="grid grid-cols-3 items-center gap-4 p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300 text-sm">anthropic_claude_key</span>
                  <span className="text-gray-400 text-center">→</span>
                  <span className="text-blue-400 text-sm">anthropicApi</span>
                </div>
                
                <div className="grid grid-cols-3 items-center gap-4 p-3 bg-gray-700/50 rounded-lg">
                  <span className="text-gray-300 text-sm">wordpress_admin_pass</span>
                  <span className="text-gray-400 text-center">→</span>
                  <span className="text-blue-400 text-sm">httpBasicAuth</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bridge Controls */}
        <Card className="bg-gray-800/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">🚀 Bridge Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 mb-6">
              <Button className="bg-blue-600 hover:bg-blue-700">
                🔄 Sync All Credentials
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                🔍 Test Connections
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                📡 Refresh MCP Data
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                👁️ Preview JSON
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                🎯 Open N8N
              </Button>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                📚 MCP Repo
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-white">525</div>
                <div className="text-gray-400 text-sm">Total N8N Nodes</div>
              </div>
              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-white">522</div>
                <div className="text-gray-400 text-sm">Successfully Synced</div>
              </div>
              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-gray-400 text-sm">Pending/Errors</div>
              </div>
              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-white">263</div>
                <div className="text-gray-400 text-sm">AI-Capable Nodes</div>
              </div>
              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-white">99%</div>
                <div className="text-gray-400 text-sm">Property Coverage</div>
              </div>
              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-white">~12ms</div>
                <div className="text-gray-400 text-sm">MCP Query Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bridge Logs */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">📊 Bridge Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
              <div>[2025-01-21 14:23:45] 🚀 Starting credential sync from Infisical...</div>
              <div>[2025-01-21 14:23:46] ✅ Retrieved 525 secrets from Infisical</div>
              <div>[2025-01-21 14:23:46] 🔄 Transformed to 12 credential types</div>
              <div>[2025-01-21 14:23:47] ✅ Credentials served to N8N</div>
              <div>[2025-01-21 14:23:47] 📊 Sync completed: 522 success, 3 pending</div>
              <div>[2025-01-21 14:24:12] 🔍 Health check: Bridge service healthy</div>
              <div>[2025-01-21 14:24:45] ⚠️  Credential mapping warning: wordpress_admin_pass → unknown type</div>
              <div>[2025-01-21 14:25:01] 🔄 Auto-sync triggered by Infisical webhook</div>
              <div>[2025-01-21 14:25:15] 📡 Connecting to n8n-MCP server (techfundoffice/n8n-mcp)</div>
              <div>[2025-01-21 14:25:16] ✅ MCP connection established - 525+ nodes available</div>
              <div>[2025-01-21 14:25:17] 🤖 Discovered 263 AI-capable nodes via MCP</div>
              <div>[2025-01-21 14:25:18] 📋 Real-time credential mapping updated from MCP data</div>
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
