
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useCredits } from "@/hooks/useCredits";
import { useAuth } from "@/hooks/useAuth";
import { generateWorkflow, enhanceWorkflow } from '@/utils/workflowApi';
import { Message, ChatbotProps } from '@/types/chat';
import N8nLogo from './N8nLogo';
import ChatHeader from './chat/ChatHeader';
import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';
import LoadingIndicator from './chat/LoadingIndicator';

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

  const handleCopyWorkflow = (workflowData: any) => {
    copyToClipboard(JSON.stringify(workflowData, null, 2));
  };

  const handleSelectWorkflow = (workflowData: any) => {
    setSelectedWorkflow(workflowData);
  };

  const handleClearSelectedWorkflow = () => {
    setSelectedWorkflow(null);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !user) return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      const isEnhancement = selectedWorkflow !== null;
      const creditsNeeded = isEnhancement ? 10 : 15;

      if (!hasCredits(creditsNeeded)) {
        addMessage('bot', `Sorry, you need at least ${creditsNeeded} credits for this operation. Generation costs 15 credits, enhancement costs 10 credits.`, 0, null, true);
        setIsLoading(false);
        return;
      }

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
        <ChatHeader credits={credits} onToggle={onToggle} />

        {/* Messages */}
        <ScrollArea className="flex-1 h-[calc(100vh-140px)] p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onCopyWorkflow={handleCopyWorkflow}
                onSelectWorkflow={handleSelectWorkflow}
              />
            ))}
            {isLoading && <LoadingIndicator />}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <ChatInput
          input={input}
          setInput={setInput}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          user={user}
          selectedWorkflow={selectedWorkflow}
          onClearSelectedWorkflow={handleClearSelectedWorkflow}
        />
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
