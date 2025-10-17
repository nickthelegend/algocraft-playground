import { NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, templateType, repoUrl, link, metadata, recaptchaToken } = body

    // Verify reCAPTCHA
    if (!recaptchaToken) {
      return NextResponse.json({ error: "reCAPTCHA verification required" }, { status: 400 })
    }

    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
    })

    const recaptchaResult = await recaptchaResponse.json()
    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
      return NextResponse.json({ error: "reCAPTCHA verification failed" }, { status: 400 })
    }

    if (!name || !templateType) {
      return NextResponse.json({ error: "Name and template type are required" }, { status: 400 })
    }

    // Get user from database to get username
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const slugname = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')

    const project = await prisma.project.create({
      data: {
        name,
        description,
        slugname: `${slugname}-${Date.now()}`,
        templateType,
        repoUrl,
        link,
        metadata,
        userId: user.id,
        username: dbUser.username,
        email: user.email!,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}