
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { n8nService } from '@/services/n8nService';
import { N8nWorkflow } from '@/types/n8n';
import WorkflowStats from './workflows/WorkflowStats';
import WorkflowFilters from './workflows/WorkflowFilters';
import WorkflowList from './workflows/WorkflowList';

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
      console.log('Fetching workflows from n8n...');
      const response = await n8nService.getWorkflows({ limit: 100 });
      console.log('Workflows response:', response);
      
      const workflowsData = Array.isArray(response.data) ? response.data : [];
      console.log('Processed workflows data:', workflowsData);
      setWorkflows(workflowsData);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      toast({
        title: "Error",
        description: "Failed to fetch workflows from n8n instance",
        variant: "destructive"
      });
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  const filterWorkflows = () => {
    let filtered = workflows;

    if (searchTerm) {
      filtered = filtered.filter(workflow => 
        workflow.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
      console.log(`Performing ${action} on workflow ${workflowId}`);
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
        <span className="ml-2 text-gray-400">Loading workflows...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WorkflowStats
        total={stats.total}
        active={stats.active}
        inactive={stats.inactive}
        loading={loading}
        onRefresh={fetchAllWorkflows}
      />

      <WorkflowFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <WorkflowList
        filteredWorkflows={filteredWorkflows}
        totalWorkflows={workflows.length}
        actionLoading={actionLoading}
        onWorkflowAction={handleWorkflowAction}
      />
    </div>
  );
};

export default N8nWorkflowsViewer;
