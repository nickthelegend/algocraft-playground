import { NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, templateType, repoUrl, link, metadata } = body

    if (!name || !templateType) {
      return NextResponse.json({ error: "Name and template type are required" }, { status: 400 })
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
        username: user.user_metadata?.full_name || user.email?.split('@')[0] || 'user',
        email: user.email!,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}