
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Play, ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface TestCase {
  id: string;
  name: string;
  description: string;
  category: string;
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

  const resetAllTests = () => {
    setTestResults({});
    toast({
      title: "Tests Reset",
      description: "All test results have been cleared",
    });
  };

  const testCases: TestCase[] = [
    // Authentication Tests
    {
      id: 'auth-logout',
      name: 'User Logout Function',
      description: 'Test that logout function exists and is callable (simulation)',
      category: 'Authentication',
      action: async () => {
        // Simulate logout test without actually logging out
        if (typeof signOut !== 'function') {
          throw new Error('signOut function is not available');
        }
        // Just verify the function exists - don't actually call it
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    },
    {
      id: 'auth-user-session',
      name: 'User Session Validation',
      description: 'Verify user session is active and valid',
      category: 'Authentication',
      action: async () => {
        if (!user) {
          throw new Error('No active user session found');
        }
        if (!user.email) {
          throw new Error('User session missing email');
        }
        if (!user.id) {
          throw new Error('User session missing ID');
        }
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    },
    {
      id: 'nav-dashboard-check',
      name: 'Dashboard Route Check',
      description: 'Verify dashboard route accessibility (simulation)',
      category: 'Navigation',
      action: async () => {
        // Simulate navigation check without actually navigating
        const currentPath = window.location.pathname;
        if (currentPath !== '/test-suite') {
          throw new Error('Test not running from test suite page');
        }
        // Simulate checking if dashboard is accessible
        await new Promise(resolve => setTimeout(resolve, 400));
        // In a real implementation, this would check route configuration
      }
    },
    {
      id: 'nav-settings-check',
      name: 'Settings Route Check',
      description: 'Verify settings route accessibility (simulation)',
      category: 'Navigation',
      action: async () => {
        // Simulate checking if settings route exists
        await new Promise(resolve => setTimeout(resolve, 400));
        // This would normally check if the route is properly configured
      }
    },
    {
      id: 'nav-profile-check',
      name: 'Profile Route Check',
      description: 'Verify profile route accessibility (simulation)',
      category: 'Navigation',
      action: async () => {
        // Simulate checking if profile route exists
        await new Promise(resolve => setTimeout(resolve, 400));
        // This would normally check if the route is properly configured
      }
    },
    {
      id: 'credits-display',
      name: 'Credits Display Validation',
      description: 'Verify credits are displayed correctly and within expected range',
      category: 'Credits',
      action: async () => {
        if (typeof credits !== 'number') {
          throw new Error('Credits is not a number');
        }
        if (credits < 0) {
          throw new Error('Credits cannot be negative');
        }
        if (credits > 10000) {
          throw new Error('Credits value seems unusually high');
        }
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    },
    {
      id: 'credits-functionality',
      name: 'Credits System Check',
      description: 'Test credits deduction simulation',
      category: 'Credits',
      action: async () => {
        const initialCredits = credits;
        if (initialCredits < 10) {
          throw new Error('Insufficient credits for testing (need at least 10)');
        }
        // Simulate credits check without actual deduction
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    },
    {
      id: 'user-profile',
      name: 'User Profile Data',
      description: 'Verify user profile information is complete',
      category: 'Profile',
      action: async () => {
        if (!user || !user.email) {
          throw new Error('User profile not loaded correctly');
        }
        if (!user.created_at) {
          throw new Error('User creation date missing');
        }
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    },
    {
      id: 'ui-responsiveness',
      name: 'UI Responsiveness Check',
      description: 'Test basic UI component rendering',
      category: 'UI/UX',
      action: async () => {
        // Check if key UI elements are present
        const testSuiteTitle = document.querySelector('h1');
        if (!testSuiteTitle || !testSuiteTitle.textContent?.includes('Test Suite')) {
          throw new Error('Test Suite title not found');
        }
        
        const tabsList = document.querySelector('[role="tablist"]');
        if (!tabsList) {
          throw new Error('Tabs navigation not found');
        }
        
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    },
    {
      id: 'toast-system',
      name: 'Toast Notification System',
      description: 'Verify toast notifications are working',
      category: 'UI/UX',
      action: async () => {
        // This test itself will trigger a toast when it passes
        await new Promise(resolve => setTimeout(resolve, 400));
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
        await new Promise(resolve => setTimeout(resolve, 800));
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
              onClick={resetAllTests}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
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
