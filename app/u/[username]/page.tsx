import { notFound } from "next/navigation"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Code2, Calendar, Layers } from "lucide-react"

interface UserProfilePageProps {
  params: Promise<{ username: string }>
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { username } = await params

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        projects: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) {
      notFound()
    }

    // Group projects by template type
    const projectsByTemplate = user.projects.reduce((acc, project) => {
      acc[project.templateType] = (acc[project.templateType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* User Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" alt={user.username} />
                  <AvatarFallback className="text-xl">
                    {user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">@{user.username}</CardTitle>
                  {user.name && (
                    <CardDescription className="text-lg">{user.name}</CardDescription>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{user.projects.length}</p>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{Object.keys(projectsByTemplate).length}</p>
                    <p className="text-sm text-muted-foreground">Template Types</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">
                      {user.projects.length > 0 
                        ? Math.ceil((Date.now() - new Date(user.projects[user.projects.length - 1].createdAt).getTime()) / (1000 * 60 * 60 * 24))
                        : 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Days Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projects by Template */}
          <Card>
            <CardHeader>
              <CardTitle>Smart Contracts by Template</CardTitle>
              <CardDescription>
                Breakdown of projects by template type
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(projectsByTemplate).length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(projectsByTemplate).map(([template, count]) => (
                    <div key={template} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{template}</p>
                        <p className="text-sm text-muted-foreground">
                          {count} project{count !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Code2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No projects yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Projects */}
          {user.projects.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Latest smart contracts created</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {project.description || 'No description'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline">{project.templateType}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching user profile:', error)
    notFound()
  }
}