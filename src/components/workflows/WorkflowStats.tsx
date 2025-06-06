
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  CheckCircle, 
  XCircle, 
  RefreshCw 
} from 'lucide-react';

interface WorkflowStatsProps {
  total: number;
  active: number;
  inactive: number;
  loading: boolean;
  onRefresh: () => void;
}

const WorkflowStats = ({ total, active, inactive, loading, onRefresh }: WorkflowStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-white">{total}</p>
              <p className="text-gray-400 text-sm">Total Workflows</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-white">{active}</p>
              <p className="text-gray-400 text-sm">Active</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-2xl font-bold text-white">{inactive}</p>
              <p className="text-gray-400 text-sm">Inactive</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Button
              onClick={onRefresh}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white p-0 h-auto"
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 text-purple-500 ${loading ? 'animate-spin' : ''}`} />
              <span className="ml-2">Refresh</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowStats;
