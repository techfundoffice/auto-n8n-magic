
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Clock,
  Zap,
  Database,
  Wifi
} from 'lucide-react';

const TestSuite = () => {
  const testResults = [
    { name: 'Authentication', status: 'passed', duration: '0.2s' },
    { name: 'Credit System', status: 'passed', duration: '0.5s' },
    { name: 'N8n API Connection', status: 'failed', duration: '2.1s' },
    { name: 'Workflow Generation', status: 'passed', duration: '1.8s' },
    { name: 'Database Queries', status: 'passed', duration: '0.3s' },
    { name: 'Stripe Integration', status: 'pending', duration: '-' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <TestTube className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <SidebarLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Test Suite</h1>
          <p className="text-gray-400">
            Run comprehensive tests to verify all system functionality
          </p>
        </div>

        <div className="space-y-6">
          {/* Test Controls */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TestTube className="w-5 h-5 mr-2 text-blue-500" />
                Test Controls
              </CardTitle>
              <CardDescription className="text-gray-300">
                Run automated tests to verify system functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Run All Tests
                </Button>
                <Button variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                  Run API Tests
                </Button>
                <Button variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                  Run Integration Tests
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Test Results</CardTitle>
              <CardDescription className="text-gray-300">
                Latest test execution results and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(test.status)}
                      <span className="text-white">{test.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`text-sm px-2 py-1 rounded ${
                        test.status === 'passed' ? 'bg-green-600/20 text-green-400' :
                        test.status === 'failed' ? 'bg-red-600/20 text-red-400' :
                        'bg-yellow-600/20 text-yellow-400'
                      }`}>
                        {test.status}
                      </span>
                      <span className="text-gray-400 text-sm">{test.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold text-white">4/6</p>
                    <p className="text-gray-400 text-sm">Tests Passed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold text-white">98%</p>
                    <p className="text-gray-400 text-sm">System Health</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Wifi className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold text-white">45ms</p>
                    <p className="text-gray-400 text-sm">Avg Response</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default TestSuite;
