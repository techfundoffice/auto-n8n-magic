
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Bot, Copy, Code } from 'lucide-react';
import { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
  onCopyWorkflow: (workflow: any) => void;
  onSelectWorkflow: (workflow: any) => void;
}

const ChatMessage = ({ message, onCopyWorkflow, onSelectWorkflow }: ChatMessageProps) => {
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div
      className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        message.type === 'user' 
          ? 'bg-blue-600' 
          : message.isError 
            ? 'bg-red-500'
            : 'bg-gradient-to-r from-purple-500 to-pink-500'
      }`}>
        {message.type === 'user' ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
        <div
          className={`inline-block max-w-[280px] p-3 rounded-lg text-sm ${
            message.type === 'user'
              ? 'bg-blue-600 text-white'
              : message.isError
                ? 'bg-red-900/50 text-red-200 border border-red-700'
                : 'bg-gray-800 text-gray-200 border border-gray-700'
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
          {message.workflowData && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Workflow JSON:</span>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onCopyWorkflow(message.workflowData)}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    title="Copy JSON"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onSelectWorkflow(message.workflowData)}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                    title="Enhance this workflow"
                  >
                    <Code className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <div className="bg-gray-900/50 p-2 rounded text-xs text-gray-300 max-h-20 overflow-y-auto">
                <pre>{JSON.stringify(message.workflowData, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">
            {formatTimestamp(message.timestamp)}
          </span>
          {message.creditsUsed && message.creditsUsed > 0 && (
            <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs">
              -{message.creditsUsed} credits
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
