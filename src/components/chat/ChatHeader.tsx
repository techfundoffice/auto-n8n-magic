
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Zap, Settings } from 'lucide-react';

interface ChatHeaderProps {
  credits: number;
  onToggle: () => void;
}

const ChatHeader = ({ credits, onToggle }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold">AI Assistant</h3>
          <p className="text-xs text-gray-400">Generate & enhance workflows</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
          {credits} credits
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.href = '/settings'}
          className="text-gray-400 hover:text-white"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
