import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  // Mock OAuth callback handler
  if (error) {
    return NextResponse.json({ error: "OAuth authentication failed" }, { status: 400 })
  }

  if (code) {
    // In production, this would exchange the code for tokens
    return NextResponse.json({
      success: true,
      message: "OAuth callback received",
      code,
    })
  }

  return NextResponse.json({ error: "Missing authorization code" }, { status: 400 })
}
