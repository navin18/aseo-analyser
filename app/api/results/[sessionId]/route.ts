import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function GET(request: Request, { params }: { params: { sessionId: string } }) {
  const { sessionId } = params

  if (!sessionId) {
    return NextResponse.json({ success: false, message: "Session ID is required." }, { status: 400 })
  }

  try {
    const { data, error } = await supabase.from("final_prompt_scores").select("*").eq("session_id", sessionId)

    if (error) {
      console.error("Supabase query error:", error)
      throw new Error(error.message)
    }

    if (data && data.length > 0) {
      return NextResponse.json({ success: true, complete: true, top_prompts: data })
    } else {
      return NextResponse.json({ success: true, complete: false, message: "Still processing..." })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown database error occurred"
    console.error(`Error fetching results for session ${sessionId}:`, message)
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
