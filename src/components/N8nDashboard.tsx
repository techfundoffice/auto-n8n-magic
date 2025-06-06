
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Activity, 
  TestTube, 
  Eye,
  BarChart3
} from 'lucide-react';
import N8nWorkflowsViewer from './N8nWorkflowsViewer';
import N8nExecutionsMonitor from './N8nExecutionsMonitor';
import N8nApiTestSuite from './N8nApiTestSuite';

const N8nDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">N8n Management Dashboard</h2>
        <p className="text-gray-400">
          Comprehensive management and monitoring for your n8n workflows and executions
        </p>
      </div>

      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList className="bg-gray-800/50 border-gray-700">
          <TabsTrigger 
            value="workflows" 
            className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Zap className="w-4 h-4 mr-2" />
            All Workflows
          </TabsTrigger>
          <TabsTrigger 
            value="executions" 
            className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <Activity className="w-4 h-4 mr-2" />
            Live Monitoring
          </TabsTrigger>
          <TabsTrigger 
            value="testing" 
            className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <TestTube className="w-4 h-4 mr-2" />
            API Testing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-6">
          <N8nWorkflowsViewer />
        </TabsContent>

        <TabsContent value="executions" className="space-y-6">
          <N8nExecutionsMonitor />
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <N8nApiTestSuite />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default N8nDashboard;
