
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user's n8n API credentials
    const { data: apiKeys, error: apiKeyError } = await supabaseClient
      .from('user_api_keys')
      .select('api_key, api_url')
      .eq('user_id', user.id)
      .eq('provider', 'n8n')
      .single();

    if (apiKeyError || !apiKeys) {
      console.error('N8n API key not found:', apiKeyError);
      return new Response(JSON.stringify({ 
        error: 'N8n API credentials not configured. Please add them in Settings.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { endpoint, method = 'GET', data } = await req.json();
    
    if (!apiKeys.api_url) {
      return new Response(JSON.stringify({ 
        error: 'N8n API URL not configured. Please add it in Settings.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Construct the full URL
    const baseUrl = apiKeys.api_url.replace(/\/+$/, ''); // Remove trailing slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const fullUrl = `${baseUrl}${cleanEndpoint}`;

    console.log('Making n8n API request:', { method, url: fullUrl });

    // Make request to n8n API
    const n8nResponse = await fetch(fullUrl, {
      method,
      headers: {
        'X-N8N-API-KEY': apiKeys.api_key,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('N8n API error:', {
        status: n8nResponse.status,
        statusText: n8nResponse.statusText,
        body: errorText
      });
      
      return new Response(JSON.stringify({ 
        error: `N8n API error: ${n8nResponse.statusText}`,
        details: errorText
      }), {
        status: n8nResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const responseData = await n8nResponse.json();
    console.log('N8n API response received successfully');

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in n8n-api-proxy function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
