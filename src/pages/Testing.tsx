
import N8nApiTestSuite from '@/components/N8nApiTestSuite';

const Testing = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">API Testing</h1>
        <p className="text-gray-400">
          Test your n8n API connections and workflow endpoints
        </p>
      </div>
      <N8nApiTestSuite />
    </div>
  );
};

export default Testing;
