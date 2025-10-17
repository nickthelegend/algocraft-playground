"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Code2,
  Zap,
  Shield,
  Layers,
  GitBranch,
  Wallet,
  TrendingUp,
  Lock,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface Project {
  id: string
  name: string
  description: string | null
  templateType: string
  createdAt: string
  updatedAt: string
}



const ITEMS_PER_PAGE = 6

export default function ContractsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [totalProjects, setTotalProjects] = useState(0)

  useEffect(() => {
    fetchAllProjects()
  }, [])

  const fetchAllProjects = async () => {
    try {
      const response = await fetch('/api/contracts')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
        setTotalProjects(data.length)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedContracts = useMemo(() => {
    const allContracts = [...projects]
    const filtered = allContracts.filter(
      (contract) =>
        contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contract.description && contract.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ('tags' in contract && contract.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        ('templateType' in contract && contract.templateType.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    filtered.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime()
      const dateB = new Date(b.updatedAt).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

    return filtered
  }, [searchQuery, sortOrder, projects])

  const totalPages = Math.ceil(filteredAndSortedContracts.length / ITEMS_PER_PAGE)
  const paginatedContracts = filteredAndSortedContracts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleSortChange = (value: "asc" | "desc") => {
    setSortOrder(value)
    setCurrentPage(1)
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] p-4 md:p-8">
      <div className="container max-w-7xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Smart Contracts</h1>
            <p className="text-lg text-muted-foreground">
              Browse and deploy production-ready smart contracts for the Algorand blockchain
            </p>
            <div className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : `${totalProjects } total smart contracts available`}
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search contracts, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 bg-secondary/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by date:</span>
              <Select value={sortOrder} onValueChange={handleSortChange}>
                <SelectTrigger className="w-40 bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-3 w-3" />
                      Newest First
                    </div>
                  </SelectItem>
                  <SelectItem value="asc">
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-3 w-3" />
                      Oldest First
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            {loading ? 'Loading contracts...' : `Showing ${paginatedContracts.length} of ${filteredAndSortedContracts.length} contracts`}
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : paginatedContracts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedContracts.map((contract) => {
              const Icon = 'icon' in contract ? contract.icon : Code2
              const isRealProject = 'templateType' in contract
              return (
                <Card
                  key={contract.id}
                  className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full blur-2xl transition-all group-hover:bg-primary/10" />

                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {isRealProject ? (contract as Project).templateType : (contract as any).language}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{contract.name}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {contract.description || 'No description available'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {!isRealProject && 'tags' in contract && (
                      <div className="flex gap-2 flex-wrap">
                        {(contract as any).tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs border-primary/30 text-primary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {isRealProject ? 'User Project' : `By ${(contract as any).author}`}
                      </span>
                      {!isRealProject && (
                        <span className="text-muted-foreground">
                          {(contract as any).deployments.toLocaleString()} deploys
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Updated {new Date(contract.updatedAt).toLocaleDateString()}
                    </div>

                    <Button className="w-full bg-transparent" variant="outline">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="flex min-h-64 flex-col items-center justify-center gap-4 p-12">
              <Search className="h-12 w-12 text-muted-foreground" />
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">No contracts found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
              </div>
            </CardContent>
          </Card>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}