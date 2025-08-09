import { NextResponse } from "next/server"
import { randomUUID } from "crypto"

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "https://agentsofnavin.app.n8n.cloud/webhook/aseo-analyzer"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const sessionId = randomUUID()

    const payload = {
      ...body,
      sessionId, // Pass the session ID to the webhook
    }

    // Trigger the webhook but DO NOT wait for the response.
    // We use a .catch() to log any immediate errors in triggering, but we don't await the fetch.
    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => {
      console.error("Failed to trigger n8n webhook:", err)
    })

    // Immediately return the session ID to the client
    return NextResponse.json({ success: true, sessionId })
  } catch (error) {
    console.error("API route error in /start:", error)
    const message = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ success: false, message: `Server error: ${message}` }, { status: 500 })
  }
}
