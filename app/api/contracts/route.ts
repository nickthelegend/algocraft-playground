import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        templateType: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        repoUrl: true,
        link: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching contracts:", error)
    return NextResponse.json([], { status: 200 })
  }
}