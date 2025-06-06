
import N8nExecutionsMonitor from '@/components/N8nExecutionsMonitor';

const Monitoring = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Live Monitoring</h1>
        <p className="text-gray-400">
          Monitor workflow executions in real-time
        </p>
      </div>
      <N8nExecutionsMonitor />
    </div>
  );
};

export default Monitoring;
