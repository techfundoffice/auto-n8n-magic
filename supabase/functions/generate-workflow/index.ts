
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's OpenAI API key
    const { data: apiKeys, error: apiKeyError } = await supabase
      .from('user_api_keys')
      .select('api_key, api_url')
      .eq('user_id', user.id)
      .eq('provider', 'openai')
      .single();

    if (apiKeyError || !apiKeys?.api_key) {
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured. Please add your API key in Settings.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openaiUrl = apiKeys.api_url || 'https://api.openai.com/v1';

    // Call OpenAI API
    const response = await fetch(`${openaiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKeys.api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert n8n workflow generator. Create a complete, functional n8n workflow JSON based on the user's description. 

IMPORTANT: First ask the user to clarify their deployment preference:
1. "Do you want this workflow optimized for the n8n Cloud/API (seamless push to n8n platform)?"
2. "Or do you prefer a self-hosted compatible workflow (non-n8n API, standalone automation)?"

Based on their choice:
- For n8n Cloud/API: Create standard n8n workflow JSON with proper node IDs, connections, and n8n-specific configurations
- For self-hosted: Create a more generic automation workflow that can run independently with custom API calls and webhook configurations

The workflow should include:
- Proper node configurations with all required parameters
- Correct connections between nodes
- Error handling nodes where appropriate
- Realistic authentication setups
- Data transformation nodes as needed
- For n8n API: Use n8n's built-in nodes and services
- For self-hosted: Use HTTP Request nodes, webhooks, and custom scripts

Return a valid workflow JSON that matches their deployment preference.

Format your response as a JSON object with these keys:
- workflow: The complete workflow JSON
- description: A brief description of what the workflow does
- nodes: Array of node types used
- complexity: "Beginner", "Intermediate", or "Advanced"
- deployment_type: "n8n_api" or "self_hosted"
- setup_instructions: Array of setup steps specific to their deployment choice`
          },
          {
            role: 'user',
            content: `Generate a workflow for: ${prompt}

Please first ask me about my deployment preference (n8n Cloud/API vs self-hosted), then generate the appropriate workflow.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to generate workflow' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Try to parse the JSON response
    let workflowData;
    try {
      workflowData = JSON.parse(generatedContent);
    } catch (parseError) {
      // If parsing fails, return the raw content with deployment preference query
      workflowData = {
        workflow: null,
        description: generatedContent,
        nodes: [],
        complexity: "Intermediate",
        deployment_type: "unknown",
        setup_instructions: []
      };
    }

    return new Response(JSON.stringify(workflowData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-workflow function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
