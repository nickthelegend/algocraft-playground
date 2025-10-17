"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ExternalLink, Settings, Trash2 } from "lucide-react"
import { NewProjectForm } from "@/components/new-project-form"
import { signOut } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface DeployDashboardProps {
  user: {
    id: string
    email: string
    name: string
  }
}

const mockProjects = [
  {
    id: "1",
    slug: "token-factory-v2",
    name: "Token Factory V2",
    description: "Advanced ASA token creation with governance features",
    template: "TealScript",
    status: "active",
    deployedAt: "2025-01-10",
    appId: "1234567890",
  },
  {
    id: "2",
    slug: "nft-marketplace",
    name: "NFT Marketplace",
    description: "Decentralized marketplace for digital collectibles",
    template: "PyTeal",
    status: "active",
    deployedAt: "2025-01-08",
    appId: "9876543210",
  },
  {
    id: "3",
    slug: "staking-protocol",
    name: "Staking Protocol",
    description: "Flexible staking with reward distribution",
    template: "Puya (Python)",
    status: "paused",
    deployedAt: "2025-01-05",
    appId: "5555555555",
  },
]

export function DeployDashboard({ user }: DeployDashboardProps) {
  const [showNewProject, setShowNewProject] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.refresh()
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] p-4 md:p-8">
      <div className="container max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Deploy Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, <span className="text-foreground font-medium">{user.name}</span>
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        {/* New Project Form */}
        {showNewProject && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <NewProjectForm onClose={() => setShowNewProject(false)} />
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* New Project Card */}
          {!showNewProject && (
            <Card
              className="group cursor-pointer border-dashed border-2 border-border/50 bg-card/30 backdrop-blur transition-all hover:border-primary/50 hover:bg-card/50"
              onClick={() => setShowNewProject(true)}
            >
              <CardContent className="flex min-h-64 flex-col items-center justify-center gap-4 p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-all group-hover:bg-primary/20">
                  <Plus className="h-8 w-8" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-lg">New Project</h3>
                  <p className="text-sm text-muted-foreground">Deploy a new smart contract</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Existing Projects */}
          {mockProjects.map((project) => (
            <Card
              key={project.id}
              className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full blur-2xl transition-all group-hover:bg-primary/10" />

              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <CardDescription className="text-xs font-mono text-muted-foreground">
                      /{project.slug}
                    </CardDescription>
                  </div>
                  <Badge variant={project.status === "active" ? "default" : "secondary"} className="text-xs">
                    {project.status}
                  </Badge>
                </div>
                <CardDescription className="text-sm leading-relaxed pt-2">{project.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Template:</span>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    {project.template}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">App ID:</span>
                  <code className="text-xs font-mono text-foreground">{project.appId}</code>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Deployed:</span>
                  <span className="text-foreground">{new Date(project.deployedAt).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-2 bg-transparent">
                    <ExternalLink className="h-3 w-3" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
