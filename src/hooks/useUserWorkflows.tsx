
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserWorkflow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  workflow_json: any;
  created_at: string;
  updated_at: string;
}

export const useUserWorkflows = () => {
  const [workflows, setWorkflows] = useState<UserWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setWorkflows([]);
      setLoading(false);
      return;
    }

    const fetchWorkflows = async () => {
      console.log('Fetching workflows for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_workflows')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching workflows:', error);
        setWorkflows([]);
      } else {
        console.log('Fetched workflows:', data);
        setWorkflows(data || []);
      }
      
      setLoading(false);
    };

    fetchWorkflows();

    // Set up real-time subscription
    const channel = supabase
      .channel('user-workflows-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_workflows',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Workflows updated via realtime:', payload);
          fetchWorkflows(); // Refetch workflows when changes occur
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up workflows subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    workflows,
    loading,
    refetch: () => {
      if (user) {
        setLoading(true);
        const fetchWorkflows = async () => {
          const { data, error } = await supabase
            .from('user_workflows')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching workflows:', error);
            setWorkflows([]);
          } else {
            setWorkflows(data || []);
          }
          setLoading(false);
        };
        fetchWorkflows();
      }
    }
  };
};
