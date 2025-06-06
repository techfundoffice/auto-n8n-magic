
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Wifi } from 'lucide-react';

const TestingStatus = () => {
  const connectionTests = [
    { name: 'N8n API Connection', status: 'connected', latency: '45ms' },
    { name: 'Database Connection', status: 'connected', latency: '12ms' },
    { name: 'Webhook Endpoints', status: 'warning', latency: '120ms' },
    { name: 'External Services', status: 'error', latency: 'timeout' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Wifi className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Connection Status</h1>
        <p className="text-gray-400">
          Monitor the health and status of all system connections
        </p>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">System Health</CardTitle>
          <CardDescription className="text-gray-300">
            Real-time status of all critical connections and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectionTests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <p className="text-white font-medium">{test.name}</p>
                    <p className={`text-sm ${getStatusColor(test.status)}`}>
                      {test.status === 'connected' ? 'Connected' : 
                       test.status === 'warning' ? 'Connected (Slow)' : 'Connection Failed'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-300 text-sm">Latency</p>
                  <p className="text-white font-mono">{test.latency}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestingStatus;
