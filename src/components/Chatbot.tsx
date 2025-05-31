
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X, Send, Zap, Code, User, Bot, Settings, Copy, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useCredits } from "@/hooks/useCredits";
import { useAuth } from "@/hooks/useAuth";
import N8nLogo from './N8nLogo';
import { generateWorkflow, enhanceWorkflow } from '@/utils/workflowApi';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  creditsUsed?: number;
  workflowData?: any;
  isError?: boolean;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Chatbot = ({ isOpen, onToggle }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I can help you generate and enhance n8n workflows using AI. Describe what automation you need and I\'ll create a complete workflow for you.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { credits, deductCredits, hasCredits } = useCredits();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (type: 'user' | 'bot', content: string, creditsUsed?: number, workflowData?: any, isError?: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      creditsUsed,
      workflowData,
      isError
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Workflow JSON has been copied to your clipboard.",
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please copy manually.",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !user) return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      // Determine if this is a workflow generation or enhancement
      const isEnhancement = selectedWorkflow !== null;
      const creditsNeeded = isEnhancement ? 10 : 15;

      if (!hasCredits(creditsNeeded)) {
        addMessage('bot', `Sorry, you need at least ${creditsNeeded} credits for this operation. Generation costs 15 credits, enhancement costs 10 credits.`, 0, null, true);
        setIsLoading(false);
        return;
      }

      // Deduct credits first
      const success = await deductCredits(creditsNeeded);
      if (!success) {
        setIsLoading(false);
        return;
      }

      let result;
      if (isEnhancement) {
        result = await enhanceWorkflow(selectedWorkflow, userMessage);
        setSelectedWorkflow(null);
      } else {
        result = await generateWorkflow(userMessage);
      }

      if (result.error) {
        addMessage('bot', result.description, creditsNeeded, null, true);
        
        if (result.error.includes('API key')) {
          toast({
            title: "API Key Required",
            description: "Please configure your OpenAI API key in Settings to use AI features.",
            variant: "destructive"
          });
        }
      } else {
        const actionType = isEnhancement ? 'enhanced' : 'generated';
        let botMessage = `I've ${actionType} a workflow for you: "${userMessage}"\n\n${result.description}`;
        
        if (result.nodes && result.nodes.length > 0) {
          botMessage += `\n\nNodes included: ${result.nodes.join(', ')}`;
        }
        
        if (result.improvements && result.improvements.length > 0) {
          botMessage += `\n\nImprovements made: ${result.improvements.join(', ')}`;
        }
        
        if (result.complexity) {
          botMessage += `\n\nComplexity: ${result.complexity}`;
        }

        if (result.deployment_type) {
          botMessage += `\n\nDeployment Type: ${result.deployment_type === 'n8n_api' ? 'n8n Cloud/API' : 'Self-hosted'}`;
        }

        if (result.setup_instructions && result.setup_instructions.length > 0) {
          botMessage += `\n\nSetup Instructions:\n${result.setup_instructions.map(instruction => `• ${instruction}`).join('\n')}`;
        }

        addMessage('bot', botMessage, creditsNeeded, result.workflow);

        toast({
          title: "AI Workflow Ready",
          description: `${creditsNeeded} credits used successfully.`,
        });
      }

    } catch (error) {
      console.error('Error generating AI response:', error);
      addMessage('bot', 'Sorry, I encountered an error while processing your request. Please check your API key configuration in Settings and try again.', 0, null, true);
      toast({
        title: "Error",
        description: "Failed to generate response. Please check your API keys in Settings.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
        >
          <N8nLogo size={28} className="text-white" />
        </Button>
      )}

      {/* Chat Panel */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-gray-900/95 backdrop-blur-xl border-l border-gray-700/50 z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
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

        {/* Messages */}
        <ScrollArea className="flex-1 h-[calc(100vh-140px)] p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
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
                              onClick={() => copyToClipboard(JSON.stringify(message.workflowData, null, 2))}
                              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                              title="Copy JSON"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedWorkflow(message.workflowData)}
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
            ))}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="inline-block bg-gray-800 border border-gray-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-400">Generating with AI...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-700/50">
          {selectedWorkflow && (
            <div className="mb-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-400">Enhancing workflow (10 credits)</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedWorkflow(null)}
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
              onClick={handleSendMessage}
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
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default Chatbot;
