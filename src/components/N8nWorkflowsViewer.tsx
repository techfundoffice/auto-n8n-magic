
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { n8nService } from '@/services/n8nService';
import { N8nWorkflow } from '@/types/n8n';
import { 
  Play, 
  Square, 
  Search, 
  Filter, 
  RefreshCw, 
  ExternalLink,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Zap
} from 'lucide-react';

const N8nWorkflowsViewer = () => {
  const [workflows, setWorkflows] = useState<N8nWorkflow[]>([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState<N8nWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchAllWorkflows();
  }, []);

  useEffect(() => {
    filterWorkflows();
  }, [workflows, searchTerm, statusFilter]);

  const fetchAllWorkflows = async () => {
    try {
      setLoading(true);
      const response = await n8nService.getWorkflows({ limit: 100 });
      setWorkflows(response.data || []);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      toast({
        title: "Error",
        description: "Failed to fetch workflows from n8n instance",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterWorkflows = () => {
    let filtered = workflows;

    if (searchTerm) {
      filtered = filtered.filter(workflow => 
        workflow.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(workflow => 
        statusFilter === 'active' ? workflow.active : !workflow.active
      );
    }

    setFilteredWorkflows(filtered);
  };

  const handleWorkflowAction = async (action: string, workflowId: string) => {
    const loadingKey = `${action}-${workflowId}`;
    setActionLoading(prev => ({ ...prev, [loadingKey]: true }));

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
      }
      
      fetchAllWorkflows();
    } catch (error) {
      console.error(`Error ${action} workflow:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} workflow: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  const getWorkflowStats = () => {
    const total = workflows.length;
    const active = workflows.filter(w => w.active).length;
    const inactive = total - active;
    return { total, active, inactive };
  };

  const stats = getWorkflowStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
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
                <p className="text-2xl font-bold text-white">{stats.active}</p>
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
                <p className="text-2xl font-bold text-white">{stats.inactive}</p>
                <p className="text-gray-400 text-sm">Inactive</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-purple-500" />
              <Button
                onClick={fetchAllWorkflows}
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white p-0"
              >
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Workflows List */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">All N8n Workflows</CardTitle>
          <CardDescription className="text-gray-300">
            Manage all workflows from your n8n instance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredWorkflows.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              {workflows.length === 0 ? 'No workflows found in your n8n instance.' : 'No workflows match your filters.'}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredWorkflows.map((workflow) => (
                <div key={workflow.id} className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{workflow.name}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-gray-400 text-sm">ID: {workflow.id}</p>
                          {workflow.createdAt && (
                            <div className="flex items-center space-x-1 text-gray-400 text-sm">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(workflow.createdAt).toLocaleDateString()}</span>
                            </div>
                          )}
                          {workflow.nodes && (
                            <div className="flex items-center space-x-1 text-gray-400 text-sm">
                              <Activity className="w-3 h-3" />
                              <span>{workflow.nodes.length} nodes</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={workflow.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {workflow.active ? 'Active' : 'Inactive'}
                        </Badge>
                        {workflow.tags && workflow.tags.length > 0 && (
                          <Badge variant="outline" className="border-blue-500 text-blue-400">
                            {workflow.tags[0]}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWorkflowAction('execute', workflow.id)}
                        disabled={actionLoading[`execute-${workflow.id}`]}
                        className="text-gray-300 border-gray-600 hover:bg-gray-600"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleWorkflowAction(
                          workflow.active ? 'deactivate' : 'activate',
                          workflow.id
                        )}
                        disabled={actionLoading[`${workflow.active ? 'deactivate' : 'activate'}-${workflow.id}`]}
                        className="text-gray-300 border-gray-600 hover:bg-gray-600"
                      >
                        {workflow.active ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`https://your-n8n-instance.com/workflow/${workflow.id}`, '_blank')}
                        className="text-gray-300 border-gray-600 hover:bg-gray-600"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
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

export default N8nWorkflowsViewer;
