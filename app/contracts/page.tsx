"use client"

import { useState, useMemo } from "react"
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

const mockContracts = [
  {
    id: 1,
    name: "Token Factory",
    description:
      "Create and manage ASA tokens with advanced features including minting, burning, and transfer controls.",
    language: "TealScript",
    deployments: 1247,
    icon: Layers,
    tags: ["DeFi", "Tokens"],
    author: "AlgoFoundation",
    createdAt: "2024-12-15",
    updatedAt: "2025-01-10",
  },
  {
    id: 2,
    name: "NFT Marketplace",
    description: "Full-featured NFT marketplace with bidding, royalties, and atomic transfers built on Algorand.",
    language: "PyTeal",
    deployments: 892,
    icon: Code2,
    tags: ["NFT", "Marketplace"],
    author: "AlgoDevs",
    createdAt: "2024-11-20",
    updatedAt: "2025-01-08",
  },
  {
    id: 3,
    name: "Decentralized Exchange",
    description: "Automated market maker (AMM) for token swaps with liquidity pools and yield farming capabilities.",
    language: "Puya (Python)",
    deployments: 654,
    icon: GitBranch,
    tags: ["DeFi", "DEX"],
    author: "AlgoSwap",
    createdAt: "2024-10-05",
    updatedAt: "2025-01-05",
  },
  {
    id: 4,
    name: "Multi-Sig Wallet",
    description: "Secure multi-signature wallet contract with customizable approval thresholds and time locks.",
    language: "TealScript",
    deployments: 543,
    icon: Shield,
    tags: ["Security", "Wallet"],
    author: "SecureAlgo",
    createdAt: "2024-09-12",
    updatedAt: "2024-12-28",
  },
  {
    id: 5,
    name: "Staking Protocol",
    description: "Flexible staking contract with reward distribution, lock periods, and governance integration.",
    language: "Puya (TypeScript)",
    deployments: 421,
    icon: Zap,
    tags: ["DeFi", "Staking"],
    author: "AlgoStake",
    createdAt: "2024-08-22",
    updatedAt: "2024-12-20",
  },
  {
    id: 6,
    name: "Governance DAO",
    description: "Decentralized autonomous organization with proposal creation, voting, and execution mechanisms.",
    language: "TealScript",
    deployments: 387,
    icon: TrendingUp,
    tags: ["Governance", "DAO"],
    author: "AlgoGov",
    createdAt: "2024-07-30",
    updatedAt: "2024-12-15",
  },
  {
    id: 7,
    name: "Escrow Service",
    description: "Trustless escrow contract for secure peer-to-peer transactions with dispute resolution.",
    language: "PyTeal",
    deployments: 312,
    icon: Lock,
    tags: ["Security", "Escrow"],
    author: "TrustAlgo",
    createdAt: "2024-07-10",
    updatedAt: "2024-12-10",
  },
  {
    id: 8,
    name: "Payment Splitter",
    description: "Automatically split payments among multiple recipients with customizable percentages.",
    language: "TealScript",
    deployments: 289,
    icon: Wallet,
    tags: ["Payments", "Utility"],
    author: "AlgoUtils",
    createdAt: "2024-06-18",
    updatedAt: "2024-12-05",
  },
  {
    id: 9,
    name: "Lottery System",
    description: "Provably fair lottery contract with verifiable randomness and automatic prize distribution.",
    language: "Puya (Python)",
    deployments: 256,
    icon: TrendingUp,
    tags: ["Gaming", "Random"],
    author: "AlgoGames",
    createdAt: "2024-05-25",
    updatedAt: "2024-11-28",
  },
  {
    id: 10,
    name: "Subscription Manager",
    description: "Recurring payment subscription system with automatic renewals and cancellation handling.",
    language: "TealScript",
    deployments: 234,
    icon: Wallet,
    tags: ["Payments", "Subscription"],
    author: "AlgoSubs",
    createdAt: "2024-05-01",
    updatedAt: "2024-11-20",
  },
  {
    id: 11,
    name: "Crowdfunding Platform",
    description: "Decentralized crowdfunding with milestone-based fund release and refund mechanisms.",
    language: "PyTeal",
    deployments: 198,
    icon: TrendingUp,
    tags: ["Crowdfunding", "Finance"],
    author: "AlgoFund",
    createdAt: "2024-04-12",
    updatedAt: "2024-11-15",
  },
  {
    id: 12,
    name: "Vesting Contract",
    description: "Token vesting schedule with cliff periods and linear or custom release curves.",
    language: "TealScript",
    deployments: 176,
    icon: Lock,
    tags: ["Tokens", "Vesting"],
    author: "AlgoVest",
    createdAt: "2024-03-20",
    updatedAt: "2024-11-10",
  },
]

const ITEMS_PER_PAGE = 6

export default function ContractsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)

  // Filter and sort contracts
  const filteredAndSortedContracts = useMemo(() => {
    const filtered = mockContracts.filter(
      (contract) =>
        contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
    )

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime()
      const dateB = new Date(b.updatedAt).getTime()
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

    return filtered
  }, [searchQuery, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedContracts.length / ITEMS_PER_PAGE)
  const paginatedContracts = filteredAndSortedContracts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  // Reset to page 1 when search or sort changes
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
        {/* Header */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Smart Contracts</h1>
            <p className="text-lg text-muted-foreground">
              Browse and deploy production-ready smart contracts for the Algorand blockchain
            </p>
          </div>

          {/* Search and Filter Bar */}
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

          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            Showing {paginatedContracts.length} of {filteredAndSortedContracts.length} contracts
          </div>
        </div>

        {/* Contracts Grid */}
        {paginatedContracts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedContracts.map((contract) => {
              const Icon = contract.icon
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
                        {contract.language}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{contract.name}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{contract.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                      {contract.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-primary/30 text-primary">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">By {contract.author}</span>
                      <span className="text-muted-foreground">{contract.deployments.toLocaleString()} deploys</span>
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

        {/* Pagination */}
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
                  className={currentPage === page ? "glow-teal" : ""}
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
