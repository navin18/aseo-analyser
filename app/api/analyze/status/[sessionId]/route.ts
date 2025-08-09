import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import type { RecommendedPrompt } from "@/lib/types"

export const dynamic = "force-dynamic" // Ensures this route is not cached

export async function GET(request: Request, { params }: { params: { sessionId: string } }) {
  const sessionId = params.sessionId

  try {
    const results = await kv.get<RecommendedPrompt[]>(`session:${sessionId}`)

    if (results) {
      // Results are found, return them and delete from KV
      await kv.del(`session:${sessionId}`)
      return NextResponse.json({ status: "complete", data: results })
    } else {
      // Results not yet available
      return NextResponse.json({ status: "processing" })
    }
  } catch (error) {
    console.error("Error fetching results from KV:", error)
    const message = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ status: "error", message }, { status: 500 })
  }
}
