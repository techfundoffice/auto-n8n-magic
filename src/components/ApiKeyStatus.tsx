
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface ApiKeyStatusProps {
  status: 'valid' | 'invalid' | 'checking' | 'unchecked';
  provider: string;
}

const ApiKeyStatus = ({ status, provider }: ApiKeyStatusProps) => {
  const getIcon = () => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'invalid':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'checking':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'unchecked':
        return <div className="h-4 w-4 rounded-full border-2 border-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-shrink-0">
      {getIcon()}
    </div>
  );
};

export default ApiKeyStatus;
