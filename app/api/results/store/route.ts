import { NextResponse } from "next/server"

const AUTH_TOKEN = process.env.N8N_CALLBACK_SECRET

export async function POST(request: Request) {
  const authorization = request.headers.get("Authorization")

  if (!AUTH_TOKEN || authorization !== `Bearer ${AUTH_TOKEN}`) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  // This endpoint now only serves to acknowledge a notification from n8n.
  // The actual data is expected to be written to Supabase directly by the n8n workflow.
  return NextResponse.json({ success: true, message: "Notification received" })
}
