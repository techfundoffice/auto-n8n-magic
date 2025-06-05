
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { WorkflowDeployment } from '@/types/n8n';

export const useN8nDeployments = () => {
  const [deployments, setDeployments] = useState<WorkflowDeployment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) {
      setDeployments([]);
      setLoading(false);
      return;
    }

    const fetchDeployments = async () => {
      console.log('Fetching n8n deployments for user:', user.id);
      
      const { data, error } = await supabase
        .from('n8n_workflow_deployments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching n8n deployments:', error);
        setDeployments([]);
      } else {
        console.log('Fetched n8n deployments:', data);
        setDeployments(data || []);
      }
      
      setLoading(false);
    };

    fetchDeployments();

    // Set up real-time subscription
    const channel = supabase
      .channel('n8n-deployments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'n8n_workflow_deployments',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('N8n deployments updated via realtime:', payload);
          fetchDeployments();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up n8n deployments subscription');
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return {
    deployments,
    loading,
    refetch: () => {
      if (user?.id) {
        setLoading(true);
        const fetchDeployments = async () => {
          const { data, error } = await supabase
            .from('n8n_workflow_deployments')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching n8n deployments:', error);
            setDeployments([]);
          } else {
            setDeployments(data || []);
          }
          setLoading(false);
        };
        fetchDeployments();
      }
    }
  };
};
