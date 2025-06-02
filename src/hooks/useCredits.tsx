
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface UserCredits {
  id: string;
  user_id: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

export const useCredits = () => {
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCredits = async () => {
    if (!user) {
      setCredits(0);
      setLoading(false);
      return;
    }

    console.log('Fetching credits for user:', user.id);
    
    const { data, error } = await supabase
      .from('user_credits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code === 'PGRST116') {
      // No credits record exists, create one
      console.log('No credits record found, creating one...');
      const { data: newCredits, error: insertError } = await supabase
        .from('user_credits')
        .insert({ user_id: user.id, credits: 1250 })
        .select('*')
        .single();

      if (insertError) {
        console.error('Error creating credits record:', insertError);
        setCredits(0);
      } else {
        console.log('Created new credits record:', newCredits);
        setCredits(newCredits.credits);
      }
    } else if (error) {
      console.error('Error fetching credits:', error);
      setCredits(0);
    } else {
      console.log('Fetched credits:', data);
      setCredits(data.credits);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchCredits();

    // Set up real-time subscription
    const channel = supabase
      .channel('user-credits-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_credits',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          console.log('Credits updated via realtime:', payload);
          if (payload.new && typeof payload.new === 'object' && 'credits' in payload.new) {
            setCredits((payload.new as UserCredits).credits);
          }
        }
      )
      .subscribe();

    // Listen for manual credit updates
    const handleCreditsUpdated = () => {
      console.log('Manual credits refresh triggered');
      fetchCredits();
    };
    
    window.addEventListener('creditsUpdated', handleCreditsUpdated);

    return () => {
      console.log('Cleaning up credits subscription');
      supabase.removeChannel(channel);
      window.removeEventListener('creditsUpdated', handleCreditsUpdated);
    };
  }, [user]);

  const deductCredits = async (amount: number = 10): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use this feature.",
        variant: "destructive"
      });
      return false;
    }

    console.log(`Checking if user has ${amount} credits. Current balance: ${credits}`);
    
    if (credits < amount) {
      toast({
        title: "Insufficient credits",
        description: `You need at least ${amount} credits to perform this action.`,
        variant: "destructive"
      });
      return false;
    }

    console.log(`Deducting ${amount} credits from user ${user.id}`);
    
    const { data, error } = await supabase
      .from('user_credits')
      .update({ 
        credits: credits - amount,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (error) {
      console.error('Error deducting credits:', error);
      toast({
        title: "Error",
        description: "Failed to deduct credits. Please try again.",
        variant: "destructive"
      });
      return false;
    }

    console.log('Credits deducted successfully:', data);
    toast({
      title: "Credits deducted",
      description: `${amount} credits have been deducted from your balance.`,
    });
    
    return true;
  };

  const hasCredits = (amount: number = 10): boolean => {
    console.log(`Checking if user has ${amount} credits. Current balance: ${credits}`);
    return credits >= amount;
  };

  const openCreditPurchase = () => {
    // This will be used by components to trigger the purchase modal
    window.dispatchEvent(new CustomEvent('openCreditPurchase'));
  };

  return {
    credits,
    loading,
    deductCredits,
    hasCredits,
    openCreditPurchase,
    refreshCredits: fetchCredits
  };
};
