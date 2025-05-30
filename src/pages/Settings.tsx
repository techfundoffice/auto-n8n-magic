
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Save } from 'lucide-react';
import ApiKeyStatus from '@/components/ApiKeyStatus';
import { validateOpenAIKey, validateN8nKey } from '@/utils/apiKeyValidation';

const apiKeySchema = z.object({
  openai_key: z.string().optional(),
  openai_url: z.string().url().optional().or(z.literal('')),
  n8n_key: z.string().optional(),
  n8n_url: z.string().url().optional().or(z.literal(''))
});

type ApiKeyForm = z.infer<typeof apiKeySchema>;

type ValidationStatus = 'valid' | 'invalid' | 'checking' | 'unchecked';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showN8nKey, setShowN8nKey] = useState(false);
  const [openaiStatus, setOpenaiStatus] = useState<ValidationStatus>('unchecked');
  const [n8nStatus, setN8nStatus] = useState<ValidationStatus>('unchecked');

  const form = useForm<ApiKeyForm>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      openai_key: '',
      openai_url: '',
      n8n_key: '',
      n8n_url: ''
    }
  });

  useEffect(() => {
    if (user) {
      loadApiKeys();
    }
  }, [user]);

  const loadApiKeys = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_api_keys')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      const formData: ApiKeyForm = {
        openai_key: '',
        openai_url: '',
        n8n_key: '',
        n8n_url: ''
      };

      data?.forEach(key => {
        if (key.provider === 'openai') {
          formData.openai_key = key.api_key;
          formData.openai_url = key.api_url || '';
        } else if (key.provider === 'n8n') {
          formData.n8n_key = key.api_key;
          formData.n8n_url = key.api_url || '';
        }
      });

      form.reset(formData);
    } catch (error) {
      console.error('Error loading API keys:', error);
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive"
      });
    }
  };

  const validateApiKey = async (provider: 'openai' | 'n8n', apiKey: string, apiUrl?: string) => {
    if (!apiKey.trim()) return;

    if (provider === 'openai') {
      setOpenaiStatus('checking');
      const isValid = await validateOpenAIKey(apiKey, apiUrl);
      setOpenaiStatus(isValid ? 'valid' : 'invalid');
    } else if (provider === 'n8n') {
      if (!apiUrl?.trim()) {
        setN8nStatus('invalid');
        return;
      }
      setN8nStatus('checking');
      const isValid = await validateN8nKey(apiKey, apiUrl);
      setN8nStatus(isValid ? 'valid' : 'invalid');
    }
  };

  const saveApiKey = async (provider: string, apiKey: string, apiUrl?: string) => {
    if (!user || !apiKey.trim()) return;

    try {
      const { error } = await supabase
        .from('user_api_keys')
        .upsert({
          user_id: user.id,
          provider,
          api_key: apiKey.trim(),
          api_url: apiUrl?.trim() || null
        }, {
          onConflict: 'user_id,provider'
        });

      if (error) throw error;
    } catch (error) {
      console.error(`Error saving ${provider} API key:`, error);
      throw error;
    }
  };

  const onSubmit = async (data: ApiKeyForm) => {
    if (!user) return;

    setLoading(true);
    try {
      const promises = [];

      if (data.openai_key?.trim()) {
        promises.push(saveApiKey('openai', data.openai_key, data.openai_url));
      }

      if (data.n8n_key?.trim()) {
        promises.push(saveApiKey('n8n', data.n8n_key, data.n8n_url));
      }

      await Promise.all(promises);

      toast({
        title: "Success",
        description: "API keys saved successfully"
      });
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast({
        title: "Error",
        description: "Failed to save API keys",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* OpenAI Settings */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">OpenAI Configuration</CardTitle>
                  <CardDescription className="text-gray-300">
                    Configure your OpenAI API settings for AI features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="openai_key"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">API Key</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showOpenAIKey ? "text" : "password"}
                              placeholder="sk-..."
                              className="bg-gray-700 border-gray-600 text-white pr-20"
                              onBlur={(e) => {
                                field.onBlur(e);
                                if (e.target.value !== field.value) {
                                  validateApiKey('openai', e.target.value, form.getValues('openai_url'));
                                }
                              }}
                            />
                            <ApiKeyStatus status={openaiStatus} provider="OpenAI" />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                              onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                            >
                              {showOpenAIKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="openai_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">API URL (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://api.openai.com/v1"
                            className="bg-gray-700 border-gray-600 text-white"
                            onBlur={(e) => {
                              field.onBlur(e);
                              const openaiKey = form.getValues('openai_key');
                              if (openaiKey) {
                                validateApiKey('openai', openaiKey, e.target.value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* n8n Settings */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">n8n Configuration</CardTitle>
                  <CardDescription className="text-gray-300">
                    Configure your n8n API settings for workflow automation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="n8n_key"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">API Key</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showN8nKey ? "text" : "password"}
                              placeholder="n8n-api-key..."
                              className="bg-gray-700 border-gray-600 text-white pr-20"
                              onBlur={(e) => {
                                field.onBlur(e);
                                if (e.target.value !== field.value) {
                                  validateApiKey('n8n', e.target.value, form.getValues('n8n_url'));
                                }
                              }}
                            />
                            <ApiKeyStatus status={n8nStatus} provider="n8n" />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                              onClick={() => setShowN8nKey(!showN8nKey)}
                            >
                              {showN8nKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="n8n_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">API URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://your-n8n-instance.com/api/v1"
                            className="bg-gray-700 border-gray-600 text-white"
                            onBlur={(e) => {
                              field.onBlur(e);
                              const n8nKey = form.getValues('n8n_key');
                              if (n8nKey) {
                                validateApiKey('n8n', n8nKey, e.target.value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
