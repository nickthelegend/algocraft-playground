import { NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  // CORS handling
  const origin = request.headers.get('origin')
  const allowedOrigin = 'https://algocraft.fun'
  
  if (origin !== allowedOrigin) {
    return NextResponse.json({ error: "CORS: Origin not allowed" }, { status: 403 })
  }

  try {
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { templateType, signedURL } = body

    if (!templateType || !signedURL) {
      return NextResponse.json({ 
        error: "templateType and signedURL are required" 
      }, { status: 400 })
    }

    // Store the deployment request in session/temp storage
    // This will be used by the frontend to pre-populate the form
    const deploymentData = {
      templateType,
      signedURL,
      userId: user.id,
      timestamp: Date.now()
    }

    const response = NextResponse.json({ 
      success: true, 
      message: "Ready to create project",
      redirectTo: "/deploy?external=true"
    })

    // Set cookie with deployment data
    response.cookies.set('deployment-data', JSON.stringify(deploymentData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 300 // 5 minutes
    })

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
    response.headers.set('Access-Control-Allow-Methods', 'POST')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')

    return response
  } catch (error) {
    console.error("Deploy API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  const allowedOrigin = 'https://algocraft.fun'
  
  if (origin !== allowedOrigin) {
    return new NextResponse(null, { status: 403 })
  }

  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}