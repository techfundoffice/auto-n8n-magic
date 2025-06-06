
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Zap } from 'lucide-react';
import { N8nWorkflow } from '@/types/n8n';
import WorkflowCard from './WorkflowCard';

interface WorkflowListProps {
  filteredWorkflows: N8nWorkflow[];
  totalWorkflows: number;
  actionLoading: Record<string, boolean>;
  onWorkflowAction: (action: string, workflowId: string) => void;
}

const WorkflowList = ({ 
  filteredWorkflows, 
  totalWorkflows, 
  actionLoading, 
  onWorkflowAction 
}: WorkflowListProps) => {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">All N8n Workflows</CardTitle>
        <CardDescription className="text-gray-300">
          Manage all workflows from your n8n instance
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredWorkflows.length === 0 ? (
          <div className="text-center py-8">
            {totalWorkflows === 0 ? (
              <div className="text-gray-400">
                <Zap className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <p className="text-lg font-medium mb-2">No workflows found</p>
                <p className="text-sm">No workflows found in your n8n instance. Create some workflows in n8n to see them here.</p>
              </div>
            ) : (
              <div className="text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <p className="text-lg font-medium mb-2">No workflows match your filters</p>
                <p className="text-sm">Try adjusting your search term or filter settings.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWorkflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                actionLoading={actionLoading}
                onWorkflowAction={onWorkflowAction}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkflowList;
