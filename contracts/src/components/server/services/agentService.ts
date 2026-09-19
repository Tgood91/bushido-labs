import { generateGeminiResponse } from './geminiService';

export interface AgentPayload {
  prompt: string;
  strategy?: string;
  context?: Record<string, any>;
}

export async function handleAgentRequest(payload: AgentPayload) {
  const { prompt, strategy = 'default', context = {} } = payload;
  
  const systemContext = `You are the Bushido AI Trading Agent using strategy: ${strategy}.
Current Context: ${JSON.stringify(context)}`;

  const responseText = await generateGeminiResponse(`${systemContext}\nUser Prompt: ${prompt}`);

  return {
    success: true,
    strategy,
    decision: responseText,
    timestamp: new Date().toISOString()
  };
}
