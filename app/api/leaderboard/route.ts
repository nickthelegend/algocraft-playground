import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get top 5 users for quick stats
    const topUsers = await prisma.user.findMany({
      include: {
        projects: {
          select: {
            id: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        projects: {
          _count: 'desc'
        }
      },
      take: 5
    })

    // Get this month's submissions
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const thisMonthCount = await prisma.project.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    })

    const leaderboardData = {
      topUsers: topUsers.map(user => ({
        username: user.username,
        projectCount: user.projects.length
      })),
      thisMonthCount,
      totalContracts: topUsers.reduce((sum, user) => sum + user.projects.length, 0)
    }

    return NextResponse.json(leaderboardData)
  } catch (error) {
    console.error("Error fetching leaderboard data:", error)
    return NextResponse.json({ 
      topUsers: [], 
      thisMonthCount: 0, 
      totalContracts: 0 
    }, { status: 200 })
  }
}