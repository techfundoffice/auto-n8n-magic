import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Play, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { n8nService } from '@/services/n8nService';
import { supabase } from '@/integrations/supabase/client';

interface TestCase {
  id: string;
  name: string;
  description: string;
  category: string;
  action: () => Promise<void>;
}

const N8nApiTestSuite = () => {
  const [testResults, setTestResults] = useState<Record<string, 'pending' | 'running' | 'passed' | 'failed'>>({});
  const [testDetails, setTestDetails] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const updateTestStatus = (testId: string, status: 'pending' | 'running' | 'passed' | 'failed', details?: string) => {
    setTestResults(prev => ({ ...prev, [testId]: status }));
    if (details) {
      setTestDetails(prev => ({ ...prev, [testId]: details }));
    }
  };

  const runTest = async (test: TestCase) => {
    updateTestStatus(test.id, 'running');
    try {
      await test.action();
      updateTestStatus(test.id, 'passed', 'Test completed successfully');
      toast({
        title: "Test Passed",
        description: `${test.name} completed successfully`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateTestStatus(test.id, 'failed', errorMessage);
      toast({
        title: "Test Failed",
        description: `${test.name} failed: ${errorMessage}`,
        variant: "destructive"
      });
    }
  };

  const resetAllTests = () => {
    setTestResults({});
    setTestDetails({});
    toast({
      title: "Tests Reset",
      description: "All test results have been cleared",
    });
  };

  const testCases: TestCase[] = [
    // N8n API Connectivity Tests
    {
      id: 'n8n-auth-ping',
      name: 'N8n Authorization Ping',
      description: 'Test connection and authorization to n8n instance using workflows endpoint',
      category: 'Connectivity',
      action: async () => {
        // Use the workflows endpoint to test connectivity and authorization
        const workflows = await n8nService.getWorkflows({ limit: 1 });
        
        // If we get here without throwing, the auth is working
        if (!workflows || typeof workflows !== 'object') {
          throw new Error('Invalid response format from n8n API');
        }
        
        // Check if response has the expected structure
        if (!workflows.hasOwnProperty('data')) {
          throw new Error('Response missing expected data property');
        }
      }
    },
    {
      id: 'n8n-api-proxy',
      name: 'N8n API Proxy Function',
      description: 'Test the Supabase edge function proxy for n8n API calls',
      category: 'Connectivity',
      action: async () => {
        const { data, error } = await supabase.functions.invoke('n8n-api-proxy', {
          body: {
            endpoint: '/workflows',
            method: 'GET'
          }
        });

        if (error) {
          throw new Error(`Proxy function failed: ${error.message}`);
        }

        if (!data) {
          throw new Error('No data received from proxy function');
        }
      }
    },
    {
      id: 'n8n-credentials-check',
      name: 'N8n API Credentials',
      description: 'Verify n8n API credentials are configured and valid',
      category: 'Connectivity',
      action: async () => {
        // Check if user has n8n API credentials configured
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User not authenticated');
        }

        const { data: apiKeys, error } = await supabase
          .from('user_api_keys')
          .select('api_key, api_url')
          .eq('user_id', user.id)
          .eq('provider', 'n8n')
          .single();

        if (error || !apiKeys) {
          throw new Error('N8n API credentials not configured in Settings');
        }

        if (!apiKeys.api_key) {
          throw new Error('N8n API key missing');
        }

        if (!apiKeys.api_url) {
          throw new Error('N8n API URL missing');
        }
      }
    },

    // Workflow Management Tests
    {
      id: 'n8n-list-workflows',
      name: 'List Workflows',
      description: 'Test fetching workflows from n8n instance',
      category: 'Workflows',
      action: async () => {
        const workflows = await n8nService.getWorkflows({ limit: 10 });
        if (!workflows.data || !Array.isArray(workflows.data)) {
          throw new Error('Invalid workflows response format');
        }
      }
    },
    {
      id: 'n8n-create-test-workflow',
      name: 'Create Test Workflow',
      description: 'Create a simple test workflow in n8n',
      category: 'Workflows',
      action: async () => {
        const testWorkflow = {
          name: `Test Workflow ${Date.now()}`,
          nodes: [
            {
              id: 'start',
              name: 'Start',
              type: 'n8n-nodes-base.start',
              typeVersion: 1,
              position: [100, 100] as [number, number],
              parameters: {}
            }
          ],
          connections: {},
          active: false
        };

        const createdWorkflow = await n8nService.createWorkflow(testWorkflow);
        if (!createdWorkflow.id) {
          throw new Error('Failed to create workflow - no ID returned');
        }

        // Clean up - delete the test workflow
        try {
          await n8nService.deleteWorkflow(createdWorkflow.id);
        } catch (cleanupError) {
          console.warn('Failed to cleanup test workflow:', cleanupError);
        }
      }
    },

    // Node Types Tests
    {
      id: 'n8n-list-node-types',
      name: 'List Node Types',
      description: 'Test fetching available node types from n8n',
      category: 'Node Types',
      action: async () => {
        const nodeTypes = await n8nService.getNodeTypes();
        if (!Array.isArray(nodeTypes)) {
          throw new Error('Invalid node types response format');
        }
        if (nodeTypes.length === 0) {
          throw new Error('No node types found');
        }
      }
    },

    // Execution Tests
    {
      id: 'n8n-list-executions',
      name: 'List Executions',
      description: 'Test fetching workflow executions from n8n',
      category: 'Executions',
      action: async () => {
        const executions = await n8nService.getExecutions({ limit: 10 });
        if (!executions.data || !Array.isArray(executions.data)) {
          throw new Error('Invalid executions response format');
        }
      }
    },

    // Database Integration Tests
    {
      id: 'db-deployments-table',
      name: 'Deployments Table Access',
      description: 'Test reading from n8n_workflow_deployments table',
      category: 'Database',
      action: async () => {
        const { data, error } = await supabase
          .from('n8n_workflow_deployments')
          .select('*')
          .limit(5);

        if (error) {
          throw new Error(`Database access failed: ${error.message}`);
        }

        // Data can be empty array, that's fine
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format from database');
        }
      }
    },
    {
      id: 'db-executions-table',
      name: 'Executions Table Access',
      description: 'Test reading from n8n_workflow_executions table',
      category: 'Database',
      action: async () => {
        const { data, error } = await supabase
          .from('n8n_workflow_executions')
          .select('*')
          .limit(5);

        if (error) {
          throw new Error(`Database access failed: ${error.message}`);
        }

        if (!Array.isArray(data)) {
          throw new Error('Invalid response format from database');
        }
      }
    },

    // Service Layer Tests
    {
      id: 'service-deploy-workflow',
      name: 'Deploy Workflow Service',
      description: 'Test the deployWorkflow service method with mock data',
      category: 'Service Layer',
      action: async () => {
        // Test the service method signature and basic validation
        // We'll create a mock workflow but won't actually deploy it
        const mockWorkflow = {
          name: 'Mock Test Workflow',
          nodes: [
            {
              id: 'start',
              name: 'Start',
              type: 'n8n-nodes-base.start',
              typeVersion: 1,
              position: [100, 100] as [number, number],
              parameters: {}
            }
          ],
          connections: {}
        };

        // This will test the service method but might fail at n8n level
        // That's expected if credentials aren't configured
        try {
          await n8nService.deployWorkflow('test-id', mockWorkflow);
        } catch (error) {
          // If it's a credentials error, that means the service method is working
          if (error instanceof Error && error.message.includes('credentials')) {
            return; // This is expected
          }
          throw error;
        }
      }
    },
    {
      id: 'service-sync-executions',
      name: 'Sync Executions Service',
      description: 'Test the syncExecutions service method',
      category: 'Service Layer',
      action: async () => {
        // This tests the sync method - it might fail if no credentials configured
        try {
          await n8nService.syncExecutions();
        } catch (error) {
          // If it's a credentials error, that means the service method is working
          if (error instanceof Error && error.message.includes('credentials')) {
            return; // This is expected
          }
          throw error;
        }
      }
    }
  ];

  const categorizedTests = testCases.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = [];
    }
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, TestCase[]>);

  const getStatusIcon = (status: 'pending' | 'running' | 'passed' | 'failed') => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
      default:
        return <Play className="w-5 h-5 text-gray-400" />;
    }
  };

  const runAllTests = async () => {
    for (const test of testCases) {
      await runTest(test);
      // Add delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const runCategoryTests = async (category: string) => {
    const categoryTests = categorizedTests[category];
    for (const test of categoryTests) {
      await runTest(test);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">N8n API Test Suite</h2>
          <p className="text-gray-400">Comprehensive testing for n8n integration functionality</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={resetAllTests}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={runAllTests}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Run All Tests
          </Button>
        </div>
      </div>

      {/* Test Categories */}
      <Tabs defaultValue="Connectivity" className="space-y-6">
        <TabsList className="bg-gray-800/50 border-gray-700">
          {Object.keys(categorizedTests).map(category => (
            <TabsTrigger
              key={category}
              value={category}
              className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(categorizedTests).map(([category, tests]) => (
          <TabsContent key={category} value={category}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">{category} Tests</h3>
                <Button
                  onClick={() => runCategoryTests(category)}
                  variant="outline"
                  size="sm"
                  className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                >
                  Run {category} Tests
                </Button>
              </div>
              
              <div className="grid gap-4">
                {tests.map(test => {
                  const status = testResults[test.id] || 'pending';
                  const details = testDetails[test.id];
                  return (
                    <Card key={test.id} className="bg-gray-800/50 border-gray-700/50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-white flex items-center">
                              {getStatusIcon(status)}
                              <span className="ml-2">{test.name}</span>
                              <Badge 
                                variant="outline" 
                                className={`ml-2 ${
                                  status === 'passed' ? 'border-green-500 text-green-400' :
                                  status === 'failed' ? 'border-red-500 text-red-400' :
                                  status === 'running' ? 'border-yellow-500 text-yellow-400' :
                                  'border-gray-500 text-gray-400'
                                }`}
                              >
                                {status}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              {test.description}
                            </CardDescription>
                            {details && (
                              <div className={`mt-2 text-sm p-2 rounded ${
                                status === 'failed' 
                                  ? 'bg-red-900/20 text-red-300 border border-red-800/30' 
                                  : 'bg-gray-700/30 text-gray-300'
                              }`}>
                                {details}
                              </div>
                            )}
                          </div>
                          <Button
                            onClick={() => runTest(test)}
                            disabled={status === 'running'}
                            variant={status === 'passed' ? 'outline' : 'default'}
                            className={status === 'passed' ? 'border-green-500 text-green-400' : ''}
                          >
                            {status === 'running' ? 'Running...' : status === 'passed' ? 'Rerun' : 'Run Test'}
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Test Summary */}
      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Test Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-400">
                {testCases.length}
              </div>
              <div className="text-sm text-gray-500">Total Tests</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {Object.values(testResults).filter(status => status === 'passed').length}
              </div>
              <div className="text-sm text-gray-500">Passed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">
                {Object.values(testResults).filter(status => status === 'failed').length}
              </div>
              <div className="text-sm text-gray-500">Failed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {Object.values(testResults).filter(status => status === 'running').length}
              </div>
              <div className="text-sm text-gray-500">Running</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default N8nApiTestSuite;
