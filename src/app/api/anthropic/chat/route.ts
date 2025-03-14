import { StreamingTextResponse } from 'ai';
import { Anthropic } from '@anthropic-ai/sdk';

// Check if API key is present
if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const systemPrompt = `You are Morpheus, a friendly AI guide in a task management app. Keep your responses short, casual, and helpful - like a knowledgeable friend. Think Rick Rubin's conversational style.

Core Style:
- Keep it brief (1-2 sentences per response)
- Use casual, friendly language
- Be direct and clear
- Skip the philosophy, focus on practical advice

Your guidance should be:
- Simple observations about their work patterns
- Quick, actionable suggestions
- Light Matrix references only when relevant

Remember: Talk like a friend giving quick advice, not a guru giving a lecture.`;

export async function POST(req: Request) {
  try {
    const { messages, userId, userTasks, currentTime } = await req.json();
    
    const latestMessage = messages[messages.length - 1].content;
    
    // Prepare context for the AI
    const contextualPrompt = `
Current Context:
Time: ${currentTime}
Tasks: ${userTasks?.length || 0} items

Their Message: ${latestMessage}

Keep your response short and friendly.`;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 150,
        temperature: 0.5,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: contextualPrompt,
          },
        ],
      });

      // Get the complete response
      const fullResponse = response.content.find(block => block.type === 'text')?.text || 'No response generated';
      
      // Create a stream with the complete message
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(fullResponse));
          controller.close();
        },
      });

      return new StreamingTextResponse(stream);
    } catch (error: any) {
      console.error('Anthropic API Error:', error.message);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate response',
          details: error.message 
        }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
  } catch (error: any) {
    console.error('Request parsing error:', error.message);
    return new Response(
      JSON.stringify({ 
        error: 'Invalid request format',
        details: error.message 
      }),
      { 
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 