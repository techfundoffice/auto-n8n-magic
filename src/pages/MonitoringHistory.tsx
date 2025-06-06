
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Clock, CheckCircle, XCircle } from 'lucide-react';

const MonitoringHistory = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Execution History</h1>
        <p className="text-gray-400">
          View historical workflow execution data and logs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-white">247</p>
                <p className="text-gray-400 text-sm">Total Executions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-white">231</p>
                <p className="text-gray-400 text-sm">Successful</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-white">16</p>
                <p className="text-gray-400 text-sm">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Execution History</CardTitle>
          <CardDescription className="text-gray-300">
            Detailed execution logs and performance metrics (Coming Soon)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-medium mb-2 text-gray-400">Historical Data Coming Soon</p>
            <p className="text-sm text-gray-500">We're working on bringing you comprehensive execution history and analytics.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringHistory;
