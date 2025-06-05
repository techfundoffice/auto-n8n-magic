
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { WorkflowExecution } from '@/types/n8n';

export const useN8nExecutions = () => {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) {
      setExecutions([]);
      setLoading(false);
      return;
    }

    const fetchExecutions = async () => {
      console.log('Fetching n8n executions for user:', user.id);
      
      const { data, error } = await supabase
        .from('n8n_workflow_executions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching n8n executions:', error);
        setExecutions([]);
      } else {
        console.log('Fetched n8n executions:', data);
        setExecutions((data || []) as WorkflowExecution[]);
      }
      
      setLoading(false);
    };

    fetchExecutions();

    // Set up real-time subscription
    const channel = supabase
      .channel('n8n-executions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'n8n_workflow_executions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('N8n executions updated via realtime:', payload);
          fetchExecutions();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up n8n executions subscription');
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    executions,
    loading,
    refetch: () => {
      if (user?.id) {
        setLoading(true);
        const fetchExecutions = async () => {
          const { data, error } = await supabase
            .from('n8n_workflow_executions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(100);

          if (error) {
            console.error('Error fetching n8n executions:', error);
            setExecutions([]);
          } else {
            setExecutions((data || []) as WorkflowExecution[]);
          }
          setLoading(false);
        };
        fetchExecutions();
      }
    }
  };
};
