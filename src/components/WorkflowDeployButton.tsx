
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { n8nService } from '@/services/n8nService';
import { useCredits } from '@/hooks/useCredits';
import { Play, Loader2 } from 'lucide-react';

interface WorkflowDeployButtonProps {
  workflow: any;
  workflowId?: string;
  onDeploySuccess?: (n8nWorkflowId: string) => void;
}

const WorkflowDeployButton = ({ workflow, workflowId, onDeploySuccess }: WorkflowDeployButtonProps) => {
  const [deploying, setDeploying] = useState(false);
  const { toast } = useToast();
  const { credits, deductCredits } = useCredits();

  const handleDeploy = async () => {
    if (credits < 10) {
      toast({
        title: "Insufficient Credits",
        description: "You need at least 10 credits to deploy a workflow.",
        variant: "destructive"
      });
      return;
    }

    setDeploying(true);
    try {
      console.log('Starting workflow deployment...');
      
      const n8nWorkflowId = await n8nService.deployWorkflow(workflowId || '', workflow);
      
      // Deduct credits for deployment
      await deductCredits(10, 'Workflow deployment');
      
      toast({
        title: "Deployment Successful",
        description: `Workflow deployed to n8n with ID: ${n8nWorkflowId}`,
      });

      if (onDeploySuccess) {
        onDeploySuccess(n8nWorkflowId);
      }
    } catch (error) {
      console.error('Deployment failed:', error);
      toast({
        title: "Deployment Failed",
        description: error instanceof Error ? error.message : "Failed to deploy workflow",
        variant: "destructive"
      });
    } finally {
      setDeploying(false);
    }
  };

  return (
    <Button
      onClick={handleDeploy}
      disabled={deploying || credits < 10}
      className="bg-green-600 hover:bg-green-700"
    >
      {deploying ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Play className="w-4 h-4 mr-2" />
      )}
      {deploying ? 'Deploying...' : 'Deploy to n8n'}
      <span className="ml-2 text-xs opacity-75">(10 credits)</span>
    </Button>
  );
};

export default WorkflowDeployButton;
