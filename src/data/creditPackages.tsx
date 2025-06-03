
import { CreditPackage } from '@/types/creditPackage';
import { Zap, Star, Crown } from 'lucide-react';

// TODO: Replace these with your actual Stripe Payment Link URLs from the dashboard
export const creditPackages: CreditPackage[] = [
  {
    id: 'starter',
    credits: 500,
    price: 5,
    name: 'Starter',
    description: 'Perfect for trying out AutoN8n',
    icon: <Zap className="w-6 h-6" />,
    paymentLink: 'https://buy.stripe.com/test_starter_replace_with_actual_link'
  },
  {
    id: 'professional',
    credits: 1000,
    price: 9,
    name: 'Professional',
    description: 'Best value for regular users',
    popular: true,
    icon: <Star className="w-6 h-6" />,
    paymentLink: 'https://buy.stripe.com/test_professional_replace_with_actual_link'
  },
  {
    id: 'enterprise',
    credits: 2500,
    price: 20,
    name: 'Enterprise',
    description: 'For heavy automation users',
    icon: <Crown className="w-6 h-6" />,
    paymentLink: 'https://buy.stripe.com/test_enterprise_replace_with_actual_link'
  }
];
