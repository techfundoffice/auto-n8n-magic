
export const validateOpenAIKey = async (apiKey: string, apiUrl?: string): Promise<boolean> => {
  if (!apiKey.trim()) return false;

  try {
    const baseUrl = apiUrl?.trim() || 'https://api.openai.com/v1';
    const response = await fetch(`${baseUrl}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error validating OpenAI key:', error);
    return false;
  }
};

export const validateN8nKey = async (apiKey: string, apiUrl: string): Promise<boolean> => {
  if (!apiKey.trim() || !apiUrl.trim()) return false;

  try {
    // Try to access a basic n8n endpoint (workflows list or health check)
    const response = await fetch(`${apiUrl}/workflows`, {
      method: 'GET',
      headers: {
        'X-N8N-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error validating n8n key:', error);
    return false;
  }
};
