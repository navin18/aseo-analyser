import { NextResponse } from "next/server"
import { randomUUID } from "crypto"

const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL

if (!WEBHOOK_URL) {
  console.error("N8N_WEBHOOK_URL is not defined in environment variables.")
}

export async function POST(request: Request) {
  try {
    if (!WEBHOOK_URL) {
      throw new Error("Webhook URL is not configured on the server.")
    }

    const body = await request.json()
    const sessionId = randomUUID()

    const payload = {
      ...body,
      sessionId,
    }

    // Fire-and-forget: Trigger the webhook but don't wait for its response.
    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => {
      // Log errors for triggering the webhook, but don't block the client response.
      console.error("Failed to trigger n8n webhook:", err)
    })

    return NextResponse.json({ success: true, sessionId, message: "Analysis started" })
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred"
    console.error("API route error in /api/analyze:", error)
    return NextResponse.json({ success: false, message: `Server error: ${message}` }, { status: 500 })
  }
}
