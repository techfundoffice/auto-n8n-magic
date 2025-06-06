
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Square, 
  ExternalLink,
  Activity,
  Calendar
} from 'lucide-react';
import { N8nWorkflow } from '@/types/n8n';

interface WorkflowCardProps {
  workflow: N8nWorkflow;
  actionLoading: Record<string, boolean>;
  onWorkflowAction: (action: string, workflowId: string) => void;
}

const WorkflowCard = ({ workflow, actionLoading, onWorkflowAction }: WorkflowCardProps) => {
  const getTagDisplay = (tags: any) => {
    if (!tags || !Array.isArray(tags) || tags.length === 0) return null;
    
    const firstTag = tags[0];
    if (typeof firstTag === 'string') {
      return firstTag;
    } else if (typeof firstTag === 'object' && firstTag.name) {
      return firstTag.name;
    }
    return null;
  };

  const tagDisplay = getTagDisplay(workflow.tags);

  return (
    <div className="bg-gray-700/50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex-1">
            <h3 className="text-white font-medium">{workflow.name || 'Unnamed Workflow'}</h3>
            <div className="flex items-center space-x-4 mt-1">
              <p className="text-gray-400 text-sm">ID: {workflow.id}</p>
              {workflow.createdAt && (
                <div className="flex items-center space-x-1 text-gray-400 text-sm">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(workflow.createdAt).toLocaleDateString()}</span>
                </div>
              )}
              {workflow.nodes && Array.isArray(workflow.nodes) && (
                <div className="flex items-center space-x-1 text-gray-400 text-sm">
                  <Activity className="w-3 h-3" />
                  <span>{workflow.nodes.length} nodes</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={workflow.active ? "default" : "secondary"}
              className={workflow.active ? "bg-green-600 text-white" : "bg-gray-600 text-gray-300"}
            >
              {workflow.active ? 'Active' : 'Inactive'}
            </Badge>
            {tagDisplay && (
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                {tagDisplay}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onWorkflowAction('execute', workflow.id)}
            disabled={actionLoading[`execute-${workflow.id}`]}
            className="text-gray-300 border-gray-600 hover:bg-gray-600"
            title="Execute workflow"
          >
            <Play className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onWorkflowAction(
              workflow.active ? 'deactivate' : 'activate',
              workflow.id
            )}
            disabled={actionLoading[`${workflow.active ? 'deactivate' : 'activate'}-${workflow.id}`]}
            className="text-gray-300 border-gray-600 hover:bg-gray-600"
            title={workflow.active ? 'Deactivate workflow' : 'Activate workflow'}
          >
            {workflow.active ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(`https://your-n8n-instance.com/workflow/${workflow.id}`, '_blank')}
            className="text-gray-300 border-gray-600 hover:bg-gray-600"
            title="Open in n8n"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowCard;
