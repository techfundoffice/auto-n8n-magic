
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCredits } from "@/hooks/useCredits";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Zap, Code } from 'lucide-react';

interface CreateWorkflowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkflowCreated?: () => void;
}

const CreateWorkflowModal = ({ open, onOpenChange, onWorkflowCreated }: CreateWorkflowModalProps) => {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [workflowJson, setWorkflowJson] = useState('{\n  "nodes": [],\n  "connections": {}\n}');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { deductCredits, hasCredits } = useCredits();
  const { user } = useAuth();

  const resetForm = () => {
    setWorkflowName('');
    setWorkflowDescription('');
    setWorkflowJson('{\n  "nodes": [],\n  "connections": {}\n}');
  };

  const validateJson = (jsonString: string) => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  };

  const handleCreateWorkflow = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create workflows.",
        variant: "destructive"
      });
      return;
    }

    if (!workflowName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a workflow name.",
        variant: "destructive"
      });
      return;
    }

    if (!validateJson(workflowJson)) {
      toast({
        title: "Invalid JSON",
        description: "Please provide valid JSON for the workflow.",
        variant: "destructive"
      });
      return;
    }

    if (!hasCredits(10)) {
      return; // Credit check already shows toast
    }

    setIsCreating(true);

    try {
      // Deduct credits first
      const success = await deductCredits(10);
      if (!success) {
        setIsCreating(false);
        return;
      }

      // Parse and store the workflow
      const parsedWorkflow = JSON.parse(workflowJson);
      
      const { data, error } = await supabase
        .from('user_workflows')
        .insert({
          user_id: user.id,
          name: workflowName.trim(),
          description: workflowDescription.trim() || null,
          workflow_json: parsedWorkflow
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error creating workflow:', error);
        toast({
          title: "Error",
          description: "Failed to create workflow. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('Workflow created successfully:', data);
      toast({
        title: "Workflow created!",
        description: `"${workflowName}" has been created successfully.`,
      });

      resetForm();
      onOpenChange(false);
      onWorkflowCreated?.();

    } catch (error) {
      console.error('Error creating workflow:', error);
      toast({
        title: "Error",
        description: "Failed to create workflow. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Create New Workflow
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Build a new n8n workflow from scratch. This will cost 10 credits.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="workflow-name" className="text-gray-300">Workflow Name *</Label>
              <Input
                id="workflow-name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="bg-gray-900/50 border-gray-600 text-white"
                placeholder="My Awesome Workflow"
              />
            </div>
            <div>
              <Label htmlFor="workflow-description" className="text-gray-300">Description</Label>
              <Textarea
                id="workflow-description"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                className="bg-gray-900/50 border-gray-600 text-white"
                placeholder="Describe what this workflow does..."
                rows={3}
              />
            </div>
          </div>

          <Tabs defaultValue="visual" className="w-full">
            <TabsList className="bg-gray-700/50">
              <TabsTrigger value="visual" className="data-[state=active]:bg-blue-600">
                <Zap className="w-4 h-4 mr-2" />
                Visual Editor (Coming Soon)
              </TabsTrigger>
              <TabsTrigger value="json" className="data-[state=active]:bg-blue-600">
                <Code className="w-4 h-4 mr-2" />
                JSON Editor
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="visual" className="mt-4">
              <div className="p-8 bg-gray-900/50 border border-gray-600 rounded-lg text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">Visual Editor Coming Soon</h3>
                  <p className="text-gray-400">
                    The drag-and-drop visual editor is under development. 
                    For now, please use the JSON editor to define your workflow.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="json" className="mt-4">
              <div>
                <Label htmlFor="workflow-json" className="text-gray-300">Workflow JSON *</Label>
                <Textarea
                  id="workflow-json"
                  value={workflowJson}
                  onChange={(e) => setWorkflowJson(e.target.value)}
                  className="bg-gray-900/50 border-gray-600 text-white font-mono text-sm mt-2"
                  placeholder="Enter your n8n workflow JSON here..."
                  rows={12}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Paste your n8n workflow JSON or create a new one following the n8n format.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateWorkflow}
            disabled={isCreating || !workflowName.trim() || !hasCredits(10)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Create Workflow (10 credits)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkflowModal;
