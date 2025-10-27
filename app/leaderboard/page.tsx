import { PrismaClient } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, TrendingUp, Calendar, Code2 } from "lucide-react"
import Link from "next/link"

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

export default async function LeaderboardPage() {
  // Get top users by project count
  const topUsers = await prisma.user.findMany({
    include: {
      projects: {
        select: {
          id: true,
          templateType: true,
          createdAt: true
        }
      }
    },
    orderBy: {
      projects: {
        _count: 'desc'
      }
    },
    take: 10
  })

  // Get monthly submissions for current year
  const currentYear = new Date().getFullYear()
  const monthlyStats = await prisma.project.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: new Date(`${currentYear}-01-01`),
        lt: new Date(`${currentYear + 1}-01-01`)
      }
    },
    _count: {
      id: true
    }
  })

  // Process monthly data
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    const monthProjects = monthlyStats.filter(stat => 
      new Date(stat.createdAt).getMonth() === i
    )
    return {
      month: new Date(currentYear, i).toLocaleDateString('en', { month: 'short' }),
      count: monthProjects.reduce((sum, stat) => sum + stat._count.id, 0)
    }
  })

  const totalThisMonth = monthlyData[new Date().getMonth()].count

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground">
            Top smart contract developers and monthly statistics
          </p>
        </div>

        {/* Monthly Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Submissions ({currentYear})
            </CardTitle>
            <CardDescription>
              Smart contracts submitted each month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-4">
              {monthlyData.map((data, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold text-primary">{data.count}</div>
                  <div className="text-xs text-muted-foreground">{data.month}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This month:</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {totalThisMonth} contracts
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Developers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Top Developers
            </CardTitle>
            <CardDescription>
              Developers with the most smart contracts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUsers.map((user, index) => {
                const projectsByTemplate = user.projects.reduce((acc, project) => {
                  acc[project.templateType] = (acc[project.templateType] || 0) + 1
                  return acc
                }, {} as Record<string, number>)

                return (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link href={`/u/${user.username}`} className="font-medium hover:text-primary">
                          @{user.username}
                        </Link>
                        {user.name && (
                          <p className="text-sm text-muted-foreground">{user.name}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-lg">{user.projects.length}</div>
                        <div className="text-xs text-muted-foreground">contracts</div>
                      </div>
                      
                      <div className="flex gap-1">
                        {Object.entries(projectsByTemplate).slice(0, 3).map(([template, count]) => (
                          <Badge key={template} variant="outline" className="text-xs">
                            {template}: {count}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">
                    {topUsers.reduce((sum, user) => sum + user.projects.length, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Contracts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{topUsers.length}</p>
                  <p className="text-sm text-muted-foreground">Active Developers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{totalThisMonth}</p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}