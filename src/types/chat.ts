
export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  creditsUsed?: number;
  workflowData?: any;
  isError?: boolean;
}

export interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}
