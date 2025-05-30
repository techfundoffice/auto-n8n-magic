
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
      default:
        return null;
    }
  };

  const getMessage = () => {
    switch (status) {
      case 'valid':
        return `${provider} API key is valid`;
      case 'invalid':
        return `${provider} API key is invalid`;
      case 'checking':
        return `Checking ${provider} API key...`;
      default:
        return '';
    }
  };

  if (status === 'unchecked') return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            {getIcon()}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getMessage()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ApiKeyStatus;
