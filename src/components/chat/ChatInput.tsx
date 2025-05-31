
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  user: any;
  selectedWorkflow: any;
  onClearSelectedWorkflow: () => void;
}

const ChatInput = ({ 
  input, 
  setInput, 
  onSendMessage, 
  isLoading, 
  user, 
  selectedWorkflow, 
  onClearSelectedWorkflow 
}: ChatInputProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="p-4 border-t border-gray-700/50">
      {selectedWorkflow && (
        <div className="mb-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-400">Enhancing workflow (10 credits)</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelectedWorkflow}
              className="text-blue-400 hover:text-blue-300 h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
      <div className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={selectedWorkflow ? "How should I enhance this workflow?" : "Describe your workflow needs..."}
          className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          disabled={isLoading}
        />
        <Button
          onClick={onSendMessage}
          disabled={!input.trim() || isLoading || !user}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Generation: 15 credits • Enhancement: 10 credits
        {!user && (
          <span className="block text-yellow-400">Sign in required to use AI features</span>
        )}
      </p>
    </div>
  );
};

export default ChatInput;
