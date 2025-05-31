
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Play, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface TestCase {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  action: () => Promise<void>;
}

const TestSuite = () => {
  const { user, signOut } = useAuth();
  const { credits } = useCredits();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<Record<string, 'pending' | 'running' | 'passed' | 'failed'>>({});

  const updateTestStatus = (testId: string, status: 'pending' | 'running' | 'passed' | 'failed') => {
    setTestResults(prev => ({ ...prev, [testId]: status }));
  };

  const runTest = async (test: TestCase) => {
    updateTestStatus(test.id, 'running');
    try {
      await test.action();
      updateTestStatus(test.id, 'passed');
      toast({
        title: "Test Passed",
        description: `${test.name} completed successfully`,
      });
    } catch (error) {
      updateTestStatus(test.id, 'failed');
      toast({
        title: "Test Failed",
        description: `${test.name} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  const testCases: TestCase[] = [
    // Authentication Tests
    {
      id: 'auth-logout',
      name: 'User Logout',
      description: 'Test user logout functionality',
      category: 'Authentication',
      action: async () => {
        await signOut();
      }
    },
    {
      id: 'nav-dashboard',
      name: 'Navigate to Dashboard',
      description: 'Test navigation to dashboard page',
      category: 'Navigation',
      action: async () => {
        navigate('/dashboard');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    },
    {
      id: 'nav-settings',
      name: 'Navigate to Settings',
      description: 'Test navigation to settings page',
      category: 'Navigation',
      action: async () => {
        navigate('/settings');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    },
    {
      id: 'nav-profile',
      name: 'Navigate to Profile',
      description: 'Test navigation to profile page',
      category: 'Navigation',
      action: async () => {
        navigate('/profile');
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    },
    {
      id: 'credits-display',
      name: 'Credits Display',
      description: 'Verify credits are displayed correctly',
      category: 'Credits',
      action: async () => {
        if (typeof credits !== 'number' || credits < 0) {
          throw new Error('Credits not displaying correctly');
        }
      }
    },
    {
      id: 'user-profile',
      name: 'User Profile Display',
      description: 'Verify user profile information is shown',
      category: 'Profile',
      action: async () => {
        if (!user || !user.email) {
          throw new Error('User profile not loaded correctly');
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
      if (testResults[test.id] !== 'passed') {
        await runTest(test);
        // Add delay between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="text-white hover:bg-gray-800/50 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Test Suite</h1>
              <p className="text-gray-400">Comprehensive testing for all platform features</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
              User: {user?.email}
            </Badge>
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              Credits: {credits}
            </Badge>
            <Button
              onClick={runAllTests}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Run All Tests
            </Button>
          </div>
        </div>

        {/* Test Categories */}
        <Tabs defaultValue="Authentication" className="space-y-6">
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
              <div className="grid gap-4">
                {tests.map(test => {
                  const status = testResults[test.id] || 'pending';
                  return (
                    <Card key={test.id} className="bg-gray-800/50 border-gray-700/50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-white flex items-center">
                              {getStatusIcon(status)}
                              <span className="ml-2">{test.name}</span>
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              {test.description}
                            </CardDescription>
                          </div>
                          <Button
                            onClick={() => runTest(test)}
                            disabled={status === 'running'}
                            variant={status === 'passed' ? 'outline' : 'default'}
                            className={status === 'passed' ? 'border-green-500 text-green-400' : ''}
                          >
                            {status === 'running' ? 'Running...' : status === 'passed' ? 'Passed' : 'Run Test'}
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Test Summary */}
        <Card className="bg-gray-800/50 border-gray-700/50 mt-8">
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
    </div>
  );
};

export default TestSuite;
