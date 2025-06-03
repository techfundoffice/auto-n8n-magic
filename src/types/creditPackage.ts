
import { ReactNode } from 'react';

export interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  name: string;
  description: string;
  popular?: boolean;
  icon: ReactNode;
  paymentLink: string;
}
