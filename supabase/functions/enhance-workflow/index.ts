
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
    const { workflow, enhancementPrompt } = await req.json();

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
            content: `You are an expert n8n workflow optimizer. Enhance the provided n8n workflow based on the user's enhancement request.

Focus on:
- Adding proper error handling and retry logic
- Optimizing node configurations
- Adding data validation and transformation
- Improving security and authentication
- Adding logging and monitoring capabilities
- Optimizing performance

Return a valid enhanced n8n workflow JSON that can be imported directly into n8n.

Format your response as a JSON object with these keys:
- workflow: The enhanced n8n workflow JSON
- description: Description of what was enhanced
- improvements: Array of specific improvements made
- complexity: "Beginner", "Intermediate", or "Advanced"`
          },
          {
            role: 'user',
            content: `Original workflow: ${JSON.stringify(workflow)}\n\nEnhancement request: ${enhancementPrompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to enhance workflow' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const enhancedContent = data.choices[0].message.content;

    // Try to parse the JSON response
    let enhancedData;
    try {
      enhancedData = JSON.parse(enhancedContent);
    } catch (parseError) {
      // If parsing fails, return the raw content
      enhancedData = {
        workflow: workflow,
        description: enhancedContent,
        improvements: ["AI response parsing failed"],
        complexity: "Intermediate"
      };
    }

    return new Response(JSON.stringify(enhancedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhance-workflow function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
