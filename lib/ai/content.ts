import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generatePostContent(
  topic: string,
  communityType: string,
  existingContent?: string
): Promise<string> {
  const systemPrompt = `You are a helpful AI assistant for BLR Riders, a bike riding community in Bangalore, India.
Your task is to help users create engaging posts for the community.

Community types:
- general: General discussions about biking, experiences, tips
- rides: Posts about rides, routes, ride experiences
- questions: Questions about biking, maintenance, routes, safety
- marketplace: Buying/selling bikes, gear, accessories

Guidelines:
- Write engaging, friendly content appropriate for a biking community
- Keep it concise but informative
- Use a conversational tone
- Include relevant details about Bangalore/BLR when appropriate
- For questions: Be helpful and encouraging
- For marketplace: Be clear and professional
- Format with proper paragraphs and structure`

  const userPrompt = existingContent
    ? `Improve and expand this ${communityType} post about "${topic}":\n\n${existingContent}\n\nMake it more engaging and complete while keeping the original intent.`
    : `Generate a ${communityType} post about "${topic}" for a Bangalore bike riding community. Make it engaging and appropriate for the community.`

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-key-here') {
    throw new Error("OpenAI API key not configured")
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 500,
    })

    return completion.choices[0]?.message?.content || "Could not generate content."
  } catch (error: any) {
    console.error("OpenAI API error:", error)
    throw new Error("Failed to generate content")
  }
}

export async function generateRideDescription(
  title: string,
  startLocation: string,
  endLocation: string,
  difficulty: string,
  existingDescription?: string
): Promise<string> {
  const systemPrompt = `You are a helpful AI assistant for BLR Riders, a bike riding community in Bangalore, India.
Your task is to help create engaging ride descriptions that attract participants.

Guidelines:
- Write an exciting, informative description that makes riders want to join
- Include details about the route, scenery, and experience
- Mention difficulty level appropriately
- Add safety reminders
- Include meeting point details
- Keep it friendly and encouraging
- Format with clear paragraphs`

  const userPrompt = existingDescription
    ? `Improve this ride description:\n\nTitle: ${title}\nStart: ${startLocation}\nEnd: ${endLocation}\nDifficulty: ${difficulty}\n\nCurrent description:\n${existingDescription}\n\nMake it more engaging and complete.`
    : `Generate an engaging ride description for:\nTitle: ${title}\nStart: ${startLocation}\nEnd: ${endLocation}\nDifficulty: ${difficulty}\n\nMake it exciting and informative.`

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-key-here') {
    throw new Error("OpenAI API key not configured")
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 400,
    })

    return completion.choices[0]?.message?.content || "Could not generate description."
  } catch (error: any) {
    console.error("OpenAI API error:", error)
    throw new Error("Failed to generate description")
  }
}

export async function improveText(text: string, context?: string): Promise<string> {
  const systemPrompt = `You are a helpful AI writing assistant. Your task is to improve text while maintaining the original meaning and intent.

Guidelines:
- Improve grammar, clarity, and flow
- Make it more engaging and readable
- Keep the original tone and style
- Don't change the core message
- Format properly with paragraphs`

  const userPrompt = context
    ? `Improve this text (context: ${context}):\n\n${text}`
    : `Improve this text:\n\n${text}`

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-key-here') {
    throw new Error("OpenAI API key not configured")
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return completion.choices[0]?.message?.content || text
  } catch (error: any) {
    console.error("OpenAI API error:", error)
    throw new Error("Failed to improve text")
  }
}

export async function generateChatSuggestions(
  conversationContext: string[],
  lastMessage?: string
): Promise<string[]> {
  const systemPrompt = `You are a helpful AI assistant for BLR Riders, a bike riding community in Bangalore, India.
Generate 3-5 short, helpful message suggestions based on the conversation context.

Guidelines:
- Keep suggestions short (under 10 words each)
- Make them relevant to the conversation
- Focus on biking, routes, safety, or community topics
- Be friendly and helpful`

  const contextText = conversationContext.length > 0
    ? `Recent messages:\n${conversationContext.slice(-5).join('\n')}`
    : "Start of conversation"

  const userPrompt = lastMessage
    ? `${contextText}\n\nLast message: ${lastMessage}\n\nGenerate helpful reply suggestions.`
    : `${contextText}\n\nGenerate helpful conversation starter suggestions.`

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-key-here') {
    return [
      "What's your favorite route in Bangalore?",
      "Any tips for beginner riders?",
      "Looking for riding buddies!",
    ]
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.9,
      max_tokens: 150,
    })

    const response = completion.choices[0]?.message?.content || ""
    // Extract suggestions (they might be numbered or bulleted)
    const suggestions = response
      .split('\n')
      .map(line => line.replace(/^[\d\-\*•]\s*/, '').trim())
      .filter(line => line.length > 0 && line.length < 100)
      .slice(0, 5)

    return suggestions.length > 0 ? suggestions : [
      "What's your favorite route?",
      "Any safety tips?",
      "Looking for riding buddies!",
    ]
  } catch (error: any) {
    console.error("OpenAI API error:", error)
    return [
      "What's your favorite route in Bangalore?",
      "Any tips for beginner riders?",
      "Looking for riding buddies!",
    ]
  }
}

