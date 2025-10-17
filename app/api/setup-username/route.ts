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

    const { username } = await request.json()

    if (!username || username.length < 3) {
      return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 })
    }



    // Try to create tables if they don't exist
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "users" (
          "id" TEXT NOT NULL,
          "username" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "name" TEXT,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "users_pkey" PRIMARY KEY ("id")
        )
      `
      await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username")`
      await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email")`
    } catch (tableError) {
      console.log("Tables might already exist")
    }

    // Check if username is already taken
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 })
    }

    // Create or update user
    const dbUser = await prisma.user.upsert({
      where: { id: user.id },
      update: { username },
      create: {
        id: user.id,
        username,
        email: user.email!,
        name: user.user_metadata?.full_name || null,
      }
    })

    return NextResponse.json({ success: true, user: dbUser })
  } catch (error) {
    console.error("Error setting up username:", error)
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }



    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id }
      })
      return NextResponse.json({ hasUsername: !!dbUser?.username, user: dbUser })
    } catch (error) {
      if (error.code === 'P2021') {
        return NextResponse.json({ hasUsername: false }, { status: 200 })
      }
      throw error
    }
  } catch (error) {
    console.error("Error checking username:", error)
    return NextResponse.json({ hasUsername: false }, { status: 200 })
  }
}