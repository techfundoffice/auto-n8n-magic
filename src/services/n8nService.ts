import { supabase } from '@/integrations/supabase/client';
import { 
  N8nWorkflow, 
  N8nExecution, 
  N8nCredential, 
  N8nNodeType, 
  N8nVariable, 
  N8nHealthStatus,
  N8nApiResponse,
  N8nPaginationOptions,
  N8nWorkflowFilter,
  N8nExecutionFilter
} from '@/types/n8n';

class N8nService {
  private async callN8nApi<T>(endpoint: string, options: {
    method?: string;
    body?: any;
  } = {}): Promise<T> {
    const { data, error } = await supabase.functions.invoke('n8n-api-proxy', {
      body: {
        endpoint,
        method: options.method || 'GET',
        data: options.body
      }
    });

    if (error) {
      throw new Error(`N8n API error: ${error.message}`);
    }

    return data;
  }

  private async getCurrentUserId(): Promise<string> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      throw new Error('User not authenticated');
    }
    return user.id;
  }

  // Workflow Management
  async getWorkflows(options: N8nPaginationOptions & N8nWorkflowFilter = {}): Promise<N8nApiResponse<N8nWorkflow[]>> {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.cursor) params.append('cursor', options.cursor);
    if (options.active !== undefined) params.append('active', options.active.toString());
    if (options.tags) params.append('tags', options.tags.join(','));
    if (options.projectId) params.append('projectId', options.projectId);
    
    const endpoint = `/workflows${params.toString() ? `?${params}` : ''}`;
    return this.callN8nApi<N8nApiResponse<N8nWorkflow[]>>(endpoint);
  }

  async getWorkflow(id: string): Promise<N8nWorkflow> {
    return this.callN8nApi<N8nWorkflow>(`/workflows/${id}`);
  }

  async createWorkflow(workflow: Partial<N8nWorkflow>): Promise<N8nWorkflow> {
    return this.callN8nApi<N8nWorkflow>('/workflows', {
      method: 'POST',
      body: workflow
    });
  }

  async updateWorkflow(id: string, workflow: Partial<N8nWorkflow>): Promise<N8nWorkflow> {
    return this.callN8nApi<N8nWorkflow>(`/workflows/${id}`, {
      method: 'PUT',
      body: workflow
    });
  }

  async deleteWorkflow(id: string): Promise<void> {
    return this.callN8nApi<void>(`/workflows/${id}`, {
      method: 'DELETE'
    });
  }

  async activateWorkflow(id: string): Promise<N8nWorkflow> {
    return this.callN8nApi<N8nWorkflow>(`/workflows/${id}/activate`, {
      method: 'POST'
    });
  }

  async deactivateWorkflow(id: string): Promise<N8nWorkflow> {
    return this.callN8nApi<N8nWorkflow>(`/workflows/${id}/deactivate`, {
      method: 'POST'
    });
  }

  // Execution Management
  async getExecutions(options: N8nPaginationOptions & N8nExecutionFilter = {}): Promise<N8nApiResponse<N8nExecution[]>> {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.cursor) params.append('cursor', options.cursor);
    if (options.status) params.append('status', options.status);
    if (options.workflowId) params.append('workflowId', options.workflowId);
    if (options.includeData) params.append('includeData', options.includeData.toString());
    
    const endpoint = `/executions${params.toString() ? `?${params}` : ''}`;
    return this.callN8nApi<N8nApiResponse<N8nExecution[]>>(endpoint);
  }

  async getExecution(id: string, includeData = false): Promise<N8nExecution> {
    const params = includeData ? '?includeData=true' : '';
    return this.callN8nApi<N8nExecution>(`/executions/${id}${params}`);
  }

  async deleteExecution(id: string): Promise<void> {
    return this.callN8nApi<void>(`/executions/${id}`, {
      method: 'DELETE'
    });
  }

  async retryExecution(id: string, loadWorkflow = true): Promise<N8nExecution> {
    return this.callN8nApi<N8nExecution>(`/executions/${id}/retry`, {
      method: 'POST',
      body: { loadWorkflow }
    });
  }

  async stopExecution(id: string): Promise<N8nExecution> {
    return this.callN8nApi<N8nExecution>(`/executions/${id}/stop`, {
      method: 'POST'
    });
  }

  async executeWorkflow(workflowId: string, data?: any): Promise<N8nExecution> {
    return this.callN8nApi<N8nExecution>(`/workflows/${workflowId}/execute`, {
      method: 'POST',
      body: data ? { startNodes: [], destinationNode: '', runData: data } : {}
    });
  }

  // Credential Management
  async getCredentials(): Promise<N8nCredential[]> {
    return this.callN8nApi<N8nCredential[]>('/credentials');
  }

  async getCredential(id: string): Promise<N8nCredential> {
    return this.callN8nApi<N8nCredential>(`/credentials/${id}`);
  }

  async createCredential(credential: {
    name: string;
    type: string;
    data: Record<string, any>;
  }): Promise<N8nCredential> {
    return this.callN8nApi<N8nCredential>('/credentials', {
      method: 'POST',
      body: credential
    });
  }

  async updateCredential(id: string, credential: Partial<N8nCredential>): Promise<N8nCredential> {
    return this.callN8nApi<N8nCredential>(`/credentials/${id}`, {
      method: 'PUT',
      body: credential
    });
  }

  async deleteCredential(id: string): Promise<void> {
    return this.callN8nApi<void>(`/credentials/${id}`, {
      method: 'DELETE'
    });
  }

  // Node Types
  async getNodeTypes(): Promise<N8nNodeType[]> {
    return this.callN8nApi<N8nNodeType[]>('/node-types');
  }

  async getNodeType(nodeType: string): Promise<N8nNodeType> {
    return this.callN8nApi<N8nNodeType>(`/node-types/${nodeType}`);
  }

  // Variables
  async getVariables(): Promise<N8nVariable[]> {
    return this.callN8nApi<N8nVariable[]>('/variables');
  }

  async getVariable(id: string): Promise<N8nVariable> {
    return this.callN8nApi<N8nVariable>(`/variables/${id}`);
  }

  async createVariable(variable: { key: string; value: string }): Promise<N8nVariable> {
    return this.callN8nApi<N8nVariable>('/variables', {
      method: 'POST',
      body: variable
    });
  }

  async updateVariable(id: string, variable: { key: string; value: string }): Promise<N8nVariable> {
    return this.callN8nApi<N8nVariable>(`/variables/${id}`, {
      method: 'PUT',
      body: variable
    });
  }

  async deleteVariable(id: string): Promise<void> {
    return this.callN8nApi<void>(`/variables/${id}`, {
      method: 'DELETE'
    });
  }

  // Health Check
  async getHealth(): Promise<N8nHealthStatus> {
    return this.callN8nApi<N8nHealthStatus>('/health');
  }

  // Utility methods for deployment tracking
  async deployWorkflow(localWorkflowId: string, workflow: any): Promise<string> {
    try {
      console.log('Deploying workflow to n8n:', workflow.name);
      
      const userId = await this.getCurrentUserId();
      
      // Create workflow in n8n
      const n8nWorkflow = await this.createWorkflow({
        name: workflow.name || 'Generated Workflow',
        nodes: workflow.nodes || [],
        connections: workflow.connections || {},
        active: false,
        settings: workflow.settings || {}
      });

      console.log('N8n workflow created:', n8nWorkflow.id);

      // Track deployment in our database
      const { data: deployment, error } = await supabase
        .from('n8n_workflow_deployments')
        .insert({
          user_id: userId,
          local_workflow_id: localWorkflowId || null,
          n8n_workflow_id: n8nWorkflow.id,
          n8n_workflow_name: n8nWorkflow.name,
          deployment_status: 'deployed',
          is_active: n8nWorkflow.active || false
        })
        .select()
        .single();

      if (error) {
        console.error('Error tracking deployment:', error);
        throw error;
      }

      return n8nWorkflow.id;
    } catch (error) {
      console.error('Deployment failed:', error);
      throw error;
    }
  }

  async syncExecutions(): Promise<void> {
    try {
      const userId = await this.getCurrentUserId();
      
      // Get recent executions from n8n
      const executions = await this.getExecutions({ limit: 50 });
      
      for (const execution of executions.data) {
        // Check if we already have this execution
        const { data: existing } = await supabase
          .from('n8n_workflow_executions')
          .select('id')
          .eq('n8n_execution_id', execution.id)
          .single();

        if (!existing) {
          // Insert new execution
          await supabase
            .from('n8n_workflow_executions')
            .insert({
              user_id: userId,
              n8n_execution_id: execution.id,
              n8n_workflow_id: execution.workflowId,
              status: execution.status,
              mode: execution.mode,
              started_at: execution.startedAt,
              finished_at: execution.stoppedAt,
              error_message: execution.data?.resultData?.error?.message
            });
        } else {
          // Update existing execution
          await supabase
            .from('n8n_workflow_executions')
            .update({
              status: execution.status,
              finished_at: execution.stoppedAt,
              error_message: execution.data?.resultData?.error?.message
            })
            .eq('n8n_execution_id', execution.id);
        }
      }
    } catch (error) {
      console.error('Error syncing executions:', error);
    }
  }
}

export const n8nService = new N8nService();
