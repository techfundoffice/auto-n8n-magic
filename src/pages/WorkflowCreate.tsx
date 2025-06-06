
import { useState } from 'react';
import CreateWorkflowModal from '@/components/CreateWorkflowModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Zap, Lightbulb } from 'lucide-react';

const WorkflowCreate = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Create Workflow</h1>
        <p className="text-gray-400">
          Generate new n8n workflows using AI assistance
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Plus className="w-5 h-5 mr-2 text-blue-500" />
              AI Workflow Generator
            </CardTitle>
            <CardDescription className="text-gray-300">
              Describe your automation needs and let AI create the workflow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Start Creating
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-500" />
              Template Library
            </CardTitle>
            <CardDescription className="text-gray-300">
              Browse pre-built workflow templates (Coming Soon)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              disabled
              className="w-full bg-gray-600"
            >
              Browse Templates
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              Import Workflow
            </CardTitle>
            <CardDescription className="text-gray-300">
              Import existing workflows from n8n (Coming Soon)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              disabled
              className="w-full bg-gray-600"
            >
              Import Workflow
            </Button>
          </CardContent>
        </Card>
      </div>

      <CreateWorkflowModal 
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
};

export default WorkflowCreate;
