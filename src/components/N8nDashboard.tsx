
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useN8nDeployments } from '@/hooks/useN8nDeployments';
import { useN8nExecutions } from '@/hooks/useN8nExecutions';
import { n8nService } from '@/services/n8nService';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Square, 
  RefreshCw, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock,
  Zap,
  Trash2
} from 'lucide-react';

const N8nDashboard = () => {
  const { deployments, loading: deploymentsLoading, refetch: refetchDeployments } = useN8nDeployments();
  const { executions, loading: executionsLoading, refetch: refetchExecutions } = useN8nExecutions();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleWorkflowAction = async (action: string, workflowId: string, deploymentId?: string) => {
    const loadingKey = `${action}-${workflowId}`;
    setLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
      switch (action) {
        case 'activate':
          await n8nService.activateWorkflow(workflowId);
          toast({ title: "Success", description: "Workflow activated" });
          break;
        case 'deactivate':
          await n8nService.deactivateWorkflow(workflowId);
          toast({ title: "Success", description: "Workflow deactivated" });
          break;
        case 'execute':
          await n8nService.executeWorkflow(workflowId);
          toast({ title: "Success", description: "Workflow execution started" });
          break;
        case 'delete':
          await n8nService.deleteWorkflow(workflowId);
          toast({ title: "Success", description: "Workflow deleted" });
          break;
      }
      
      refetchDeployments();
      refetchExecutions();
      await n8nService.syncExecutions();
    } catch (error) {
      console.error(`Error ${action} workflow:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} workflow: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const handleExecutionAction = async (action: string, executionId: string) => {
    const loadingKey = `${action}-${executionId}`;
    setLoading(prev => ({ ...prev, [loadingKey]: true }));

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
      
      refetchExecutions();
    } catch (error) {
      console.error(`Error ${action} execution:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} execution: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Activity className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'deployed':
        return 'bg-green-100 text-green-800';
      case 'error':
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
      case 'syncing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (deploymentsLoading || executionsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Deployed Workflows */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-500" />
            Deployed Workflows
          </CardTitle>
          <CardDescription className="text-gray-300">
            Manage your n8n workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          {deployments.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              No workflows deployed yet. Create and deploy a workflow from the dashboard.
            </p>
          ) : (
            <div className="space-y-4">
              {deployments.map((deployment) => (
                <div key={deployment.id} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="text-white font-medium">{deployment.n8n_workflow_name}</h3>
                        <p className="text-gray-400 text-sm">ID: {deployment.n8n_workflow_id}</p>
                      </div>
                      <Badge className={getStatusColor(deployment.deployment_status)}>
                        {deployment.deployment_status}
                      </Badge>
                      {deployment.is_active && (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWorkflowAction('execute', deployment.n8n_workflow_id)}
                        disabled={loading[`execute-${deployment.n8n_workflow_id}`]}
                        className="text-gray-300 border-gray-600 hover:bg-gray-600"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWorkflowAction(
                          deployment.is_active ? 'deactivate' : 'activate',
                          deployment.n8n_workflow_id
                        )}
                        disabled={loading[`${deployment.is_active ? 'deactivate' : 'activate'}-${deployment.n8n_workflow_id}`]}
                        className="text-gray-300 border-gray-600 hover:bg-gray-600"
                      >
                        {deployment.is_active ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWorkflowAction('delete', deployment.n8n_workflow_id)}
                        disabled={loading[`delete-${deployment.n8n_workflow_id}`]}
                        className="text-red-400 border-red-600 hover:bg-red-600/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Executions */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-500" />
            Recent Executions
          </CardTitle>
          <CardDescription className="text-gray-300">
            Monitor your workflow executions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {executions.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              No executions yet. Run a workflow to see execution history.
            </p>
          ) : (
            <div className="space-y-3">
              {executions.slice(0, 10).map((execution) => (
                <div key={execution.id} className="bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(execution.status)}
                      <div>
                        <p className="text-white text-sm">Execution {execution.n8n_execution_id}</p>
                        <p className="text-gray-400 text-xs">
                          {execution.mode} • {new Date(execution.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(execution.status)}>
                        {execution.status}
                      </Badge>
                      {execution.status === 'error' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExecutionAction('retry', execution.n8n_execution_id)}
                          disabled={loading[`retry-${execution.n8n_execution_id}`]}
                          className="text-gray-300 border-gray-600 hover:bg-gray-600"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                      {execution.status === 'running' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExecutionAction('stop', execution.n8n_execution_id)}
                          disabled={loading[`stop-${execution.n8n_execution_id}`]}
                          className="text-gray-300 border-gray-600 hover:bg-gray-600"
                        >
                          <Square className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {execution.error_message && (
                    <p className="text-red-400 text-xs mt-2 bg-red-900/20 p-2 rounded">
                      {execution.error_message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default N8nDashboard;
