import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"

// This endpoint should be secured with a secret key
const AUTH_TOKEN = process.env.N8N_CALLBACK_SECRET

export async function POST(request: Request) {
  const authorization = request.headers.get("Authorization")

  if (!AUTH_TOKEN || authorization !== `Bearer ${AUTH_TOKEN}`) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { sessionId, top_prompts } = body

    if (!sessionId || !top_prompts) {
      return NextResponse.json({ success: false, message: "Missing sessionId or top_prompts" }, { status: 400 })
    }

    // Store results with a TTL of 1 hour
    await kv.set(`session:${sessionId}`, JSON.stringify(top_prompts), { ex: 3600 })

    return NextResponse.json({ success: true, message: "Results stored." })
  } catch (error) {
    console.error("Error storing results:", error)
    const message = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
