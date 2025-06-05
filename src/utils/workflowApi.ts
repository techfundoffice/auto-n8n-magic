
import { supabase } from '@/integrations/supabase/client';
import { n8nService } from '@/services/n8nService';

export interface WorkflowGenerationResult {
  workflow?: any;
  description: string;
  nodes?: string[];
  complexity?: string;
  deployment_type?: string;
  setup_instructions?: string[];
  error?: string;
  canDeploy?: boolean;
}

export interface WorkflowEnhancementResult {
  workflow?: any;
  description: string;
  nodes?: string[];
  improvements?: string[];
  complexity?: string;
  deployment_type?: string;
  setup_instructions?: string[];
  error?: string;
  canDeploy?: boolean;
}

export const generateWorkflow = async (prompt: string): Promise<WorkflowGenerationResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-workflow', {
      body: { prompt }
    });

    if (error) {
      console.error('Error calling generate-workflow function:', error);
      return { 
        description: 'Failed to generate workflow. Please check your OpenAI API key in Settings.',
        error: error.message 
      };
    }

    // Check if the workflow can be deployed (has valid n8n structure)
    const canDeploy = data.workflow && 
                     data.workflow.nodes && 
                     Array.isArray(data.workflow.nodes) &&
                     data.workflow.nodes.length > 0;

    return {
      ...data,
      canDeploy
    };
  } catch (error) {
    console.error('Error generating workflow:', error);
    return { 
      description: 'Failed to generate workflow. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const enhanceWorkflow = async (workflow: any, enhancementPrompt: string): Promise<WorkflowEnhancementResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('enhance-workflow', {
      body: { workflow, enhancementPrompt }
    });

    if (error) {
      console.error('Error calling enhance-workflow function:', error);
      return { 
        description: 'Failed to enhance workflow. Please check your OpenAI API key in Settings.',
        error: error.message 
      };
    }

    // Check if the enhanced workflow can be deployed
    const canDeploy = data.workflow && 
                     data.workflow.nodes && 
                     Array.isArray(data.workflow.nodes) &&
                     data.workflow.nodes.length > 0;

    return {
      ...data,
      canDeploy
    };
  } catch (error) {
    console.error('Error enhancing workflow:', error);
    return { 
      description: 'Failed to enhance workflow. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const deployWorkflowToN8n = async (workflowId: string, workflow: any): Promise<string> => {
  try {
    console.log('Deploying workflow to n8n via API service...');
    return await n8nService.deployWorkflow(workflowId, workflow);
  } catch (error) {
    console.error('Error deploying workflow:', error);
    throw error;
  }
};
