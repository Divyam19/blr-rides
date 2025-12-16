import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function getAIResponse(
  userMessage: string,
  context: string[]
): Promise<string> {
  const systemPrompt = `You are a helpful AI assistant for BLR Riders, a bike riding community in Bangalore, India. 
You help riders with traffic rules, safety guidelines, and best practices for bike riding in Bangalore.

Use the following knowledge base context to answer questions accurately:
${context.join('\n\n')}

Guidelines:
- Provide accurate, helpful information based on the knowledge base
- If information isn't in the knowledge base, say so but provide general helpful advice
- Be friendly, concise, and safety-focused
- Always emphasize safety and following traffic rules
- Format your responses clearly with bullet points when listing items
- If asked about something not related to bike riding or rules, politely redirect to bike-related topics`

  // Check if API key is configured
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-key-here') {
    console.warn("OpenAI API key not configured")
    return "I'm sorry, the AI assistant is not configured. Please set up your OpenAI API key in the environment variables."
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."
  } catch (error: any) {
    console.error("OpenAI API error:", error)
    
    // Handle specific API key errors
    if (error?.code === 'invalid_api_key' || error?.status === 401) {
      return "I'm sorry, the OpenAI API key is invalid or expired. Please check your API key configuration."
    }
    
    // Fallback: try to provide a basic response based on context
    if (context.length > 0) {
      const firstMatch = context[0]
      const answerMatch = firstMatch.match(/A: (.+)/)
      if (answerMatch) {
        return `Based on our knowledge base: ${answerMatch[1]}\n\n(Note: AI features are currently unavailable due to API configuration issues.)`
      }
    }
    
    throw new Error("Failed to get AI response")
  }
}

