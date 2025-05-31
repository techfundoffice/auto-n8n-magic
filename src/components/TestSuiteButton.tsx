
import { Button } from '@/components/ui/button';
import { TestTube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TestSuiteButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/test-suite')}
      variant="outline"
      className="border-purple-500/20 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/40"
    >
      <TestTube className="w-4 h-4 mr-2" />
      Test Suite
    </Button>
  );
};

export default TestSuiteButton;
