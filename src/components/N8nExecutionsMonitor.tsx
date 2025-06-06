
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { n8nService } from '@/services/n8nService';
import { N8nExecution } from '@/types/n8n';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  Play,
  Square,
  Eye,
  RotateCcw
} from 'lucide-react';

const N8nExecutionsMonitor = () => {
  const [executions, setExecutions] = useState<N8nExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchExecutions();
    const interval = setInterval(fetchExecutions, 10000); // Auto-refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchExecutions = async () => {
    try {
      const response = await n8nService.getExecutions({ limit: 50, includeData: false });
      setExecutions(response.data || []);
    } catch (error) {
      console.error('Error fetching executions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch executions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExecutionAction = async (action: string, executionId: string) => {
    const loadingKey = `${action}-${executionId}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
      switch (action) {
        case 'retry':
          await n8nService.retryExecution(executionId);
          toast({ title: "Success", description: "Execution retry started" });
          break;
        case 'stop':
          await n8nService.stopExecution(executionId);
          toast({ title: "Success", description: "Execution stopped" });
          break;
        case 'delete':
          await n8nService.deleteExecution(executionId);
          toast({ title: "Success", description: "Execution deleted" });
          break;
      }
      
      fetchExecutions();
    } catch (error) {
      console.error(`Error ${action} execution:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} execution: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
      case 'crashed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'waiting':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
      case 'crashed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getExecutionDuration = (execution: N8nExecution) => {
    if (!execution.startedAt) return null;
    const end = execution.stoppedAt || new Date().toISOString();
    const duration = new Date(end).getTime() - new Date(execution.startedAt).getTime();
    return `${Math.round(duration / 1000)}s`;
  };

  const getExecutionStats = () => {
    const total = executions.length;
    const success = executions.filter(e => e.status === 'success').length;
    const error = executions.filter(e => e.status === 'error' || e.status === 'crashed').length;
    const running = executions.filter(e => e.status === 'running').length;
    return { total, success, error, running };
  };

  const stats = getExecutionStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
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
                <p className="text-2xl font-bold text-white">{stats.success}</p>
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
                <p className="text-2xl font-bold text-white">{stats.error}</p>
                <p className="text-gray-400 text-sm">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.running}</p>
                <p className="text-gray-400 text-sm">Running</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Executions List */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Live Executions Monitor</CardTitle>
              <CardDescription className="text-gray-300">
                Real-time workflow execution monitoring
              </CardDescription>
            </div>
            <Button
              onClick={fetchExecutions}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {executions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No executions found. Run a workflow to see execution history.
            </p>
          ) : (
            <div className="space-y-3">
              {executions.map((execution) => (
                <div key={execution.id} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(execution.status)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-white font-medium">Execution {execution.id}</h4>
                          <Badge className={getStatusColor(execution.status)}>
                            {execution.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                          <span>Workflow: {execution.workflowId}</span>
                          <span>Mode: {execution.mode}</span>
                          {execution.startedAt && (
                            <span>Started: {new Date(execution.startedAt).toLocaleString()}</span>
                          )}
                          {getExecutionDuration(execution) && (
                            <span>Duration: {getExecutionDuration(execution)}</span>
                          )}
                        </div>
                        {execution.data?.resultData?.error && (
                          <div className="mt-2 p-2 bg-red-900/20 border border-red-800/30 rounded text-red-300 text-sm">
                            {execution.data.resultData.error.message}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {execution.status === 'error' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExecutionAction('retry', execution.id)}
                          disabled={actionLoading[`retry-${execution.id}`]}
                          className="text-gray-300 border-gray-600 hover:bg-gray-600"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                      {execution.status === 'running' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExecutionAction('stop', execution.id)}
                          disabled={actionLoading[`stop-${execution.id}`]}
                          className="text-gray-300 border-gray-600 hover:bg-gray-600"
                        >
                          <Square className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default N8nExecutionsMonitor;
