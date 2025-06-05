
import { Button } from '@/components/ui/button';
import { TestTube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const N8nTestButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/test-suite')}
      variant="outline"
      className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/40"
    >
      <TestTube className="w-4 h-4 mr-2" />
      Test N8n API
    </Button>
  );
};

export default N8nTestButton;
