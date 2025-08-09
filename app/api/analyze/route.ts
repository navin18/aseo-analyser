// app/api/analyze/route.ts - COMPLETE REPLACEMENT
import { NextResponse } from "next/server"

const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "https://agentsofnavin.app.n8n.cloud/webhook/aseo-analyzer"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 180000) // 3 minutes timeout

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    // Read the response as text first to avoid JSON parsing errors on non-JSON bodies
    const responseText = await response.text()

    if (!response.ok) {
      console.error("Webhook returned an error:", response.status, responseText)
      return NextResponse.json(
        { success: false, message: `Analysis service failed: ${responseText || response.statusText}` },
        { status: response.status },
      )
    }

    let data
    try {
      // Now, safely parse the text as JSON
      data = JSON.parse(responseText)
    } catch (e) {
      console.error("Failed to parse successful webhook response as JSON. Raw response:", responseText)
      // The webhook returned 200 OK but the body was not JSON. This is an error.
      return NextResponse.json(
        {
          success: false,
          message: `Analysis service returned an invalid response. Please check the n8n workflow. Response: ${responseText.substring(0, 200)}`,
        },
        { status: 502 }, // 502 Bad Gateway is appropriate here
      )
    }

    // Continue with existing logic for handling array vs. object
    if (Array.isArray(data)) {
      data = data[0]
    }

    if (!data || typeof data !== "object" || !data.success) {
      console.error("Invalid data structure after parsing:", data)
      return NextResponse.json(
        { success: false, message: data.message || "Analysis service returned an unexpected data structure." },
        { status: 502 },
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API route error:", error)

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return NextResponse.json(
          {
            success: false,
            message: "Analysis timed out. The process is taking longer than expected. Please try again.",
          },
          { status: 504 }, // Gateway Timeout
        )
      }
      return NextResponse.json({ success: false, message: `Server error: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: false, message: "An unknown server error occurred." }, { status: 500 })
  }
}
