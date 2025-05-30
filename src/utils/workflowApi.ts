
import { supabase } from '@/integrations/supabase/client';

export interface WorkflowGenerationResult {
  workflow?: any;
  description: string;
  nodes?: string[];
  complexity?: string;
  error?: string;
}

export interface WorkflowEnhancementResult {
  workflow?: any;
  description: string;
  improvements?: string[];
  complexity?: string;
  error?: string;
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

    return data;
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

    return data;
  } catch (error) {
    console.error('Error enhancing workflow:', error);
    return { 
      description: 'Failed to enhance workflow. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
