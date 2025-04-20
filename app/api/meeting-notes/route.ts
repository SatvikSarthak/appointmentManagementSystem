import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { meetingContext } = await request.json()

    if (!meetingContext) {
      return NextResponse.json({ error: "Meeting context is required" }, { status: 400 })
    }

    // Generate meeting notes using AI
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `
        Create a concise summary of the following meeting between a teacher and student.
        Focus on key points discussed, action items, and any decisions made.
        Format the summary in a structured way with bullet points for easy reading.

        Meeting context: ${meetingContext}
      `,
    })

    // In a real app, you would save this to the database
    return NextResponse.json({
      success: true,
      notes: text,
    })
  } catch (error) {
    console.error("Error generating meeting notes:", error)
    return NextResponse.json({ error: "Failed to generate meeting notes" }, { status: 500 })
  }
}

