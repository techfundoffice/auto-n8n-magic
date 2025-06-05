
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { WorkflowGenerationResult, WorkflowEnhancementResult } from '@/utils/workflowApi';
import WorkflowDeployButton from '@/components/WorkflowDeployButton';
import { Save, Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface WorkflowCreationResultProps {
  result: WorkflowGenerationResult | WorkflowEnhancementResult;
  onSave?: (workflowId: string) => void;
}

const WorkflowCreationResult = ({ result, onSave }: WorkflowCreationResultProps) => {
  const [saving, setSaving] = useState(false);
  const [savedWorkflowId, setSavedWorkflowId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user || !result.workflow) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('user_workflows')
        .insert({
          user_id: user.id,
          name: result.workflow.name || 'Generated Workflow',
          description: result.description,
          workflow_json: result.workflow
        })
        .select()
        .single();

      if (error) throw error;

      setSavedWorkflowId(data.id);
      toast({
        title: "Success",
        description: "Workflow saved successfully"
      });

      if (onSave) {
        onSave(data.id);
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      toast({
        title: "Error",
        description: "Failed to save workflow",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    if (!result.workflow) return;

    const dataStr = JSON.stringify(result.workflow, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${result.workflow.name || 'workflow'}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleDeploySuccess = (n8nWorkflowId: string) => {
    toast({
      title: "Deployment Complete",
      description: `Workflow is now live in n8n with ID: ${n8nWorkflowId}`,
    });
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Generated Workflow</CardTitle>
        <CardDescription className="text-gray-300">
          {result.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Workflow Details */}
        {result.nodes && result.nodes.length > 0 && (
          <div>
            <h4 className="text-white font-medium mb-2">Included Nodes:</h4>
            <div className="flex flex-wrap gap-2">
              {result.nodes.map((node, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                  {node}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {result.complexity && (
          <div>
            <h4 className="text-white font-medium mb-2">Complexity:</h4>
            <Badge className="bg-yellow-100 text-yellow-800">{result.complexity}</Badge>
          </div>
        )}

        {result.setup_instructions && result.setup_instructions.length > 0 && (
          <div>
            <h4 className="text-white font-medium mb-2">Setup Instructions:</h4>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <ul className="text-gray-300 text-sm space-y-1">
                {result.setup_instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">{index + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Workflow JSON Preview */}
        {result.workflow && (
          <div>
            <h4 className="text-white font-medium mb-2">Workflow Definition:</h4>
            <Textarea
              value={JSON.stringify(result.workflow, null, 2)}
              readOnly
              className="bg-gray-700 border-gray-600 text-gray-300 font-mono text-xs h-40"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-4">
          {result.workflow && !savedWorkflowId && (
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Workflow'}
            </Button>
          )}

          {result.workflow && (
            <Button
              onClick={handleDownload}
              variant="outline"
              className="text-gray-300 border-gray-600 hover:bg-gray-600"
            >
              <Download className="w-4 h-4 mr-2" />
              Download JSON
            </Button>
          )}

          {result.canDeploy && result.workflow && (
            <WorkflowDeployButton
              workflow={result.workflow}
              workflowId={savedWorkflowId || undefined}
              onDeploySuccess={handleDeploySuccess}
            />
          )}

          {!result.canDeploy && (
            <div className="text-yellow-400 text-sm bg-yellow-900/20 px-3 py-2 rounded">
              <Eye className="w-4 h-4 inline mr-2" />
              This workflow needs manual review before deployment
            </div>
          )}
        </div>

        {savedWorkflowId && (
          <div className="text-green-400 text-sm bg-green-900/20 px-3 py-2 rounded">
            ✓ Workflow saved with ID: {savedWorkflowId}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkflowCreationResult;
