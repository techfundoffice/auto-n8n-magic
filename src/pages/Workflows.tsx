
import N8nWorkflowsViewer from '@/components/N8nWorkflowsViewer';

const Workflows = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Workflows</h1>
        <p className="text-gray-400">
          Manage and view all your n8n workflows
        </p>
      </div>
      <N8nWorkflowsViewer />
    </div>
  );
};

export default Workflows;
