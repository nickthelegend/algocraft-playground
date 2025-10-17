import Link from "next/link"
import { ArrowRight, Code2, Zap, Shield, Layers, GitBranch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const popularContracts = [
  {
    id: 1,
    name: "Token Factory",
    description:
      "Create and manage ASA tokens with advanced features including minting, burning, and transfer controls.",
    language: "TealScript",
    deployments: 1247,
    icon: Layers,
    tags: ["DeFi", "Tokens"],
  },
  {
    id: 2,
    name: "NFT Marketplace",
    description: "Full-featured NFT marketplace with bidding, royalties, and atomic transfers built on Algorand.",
    language: "PyTeal",
    deployments: 892,
    icon: Code2,
    tags: ["NFT", "Marketplace"],
  },
  {
    id: 3,
    name: "Decentralized Exchange",
    description: "Automated market maker (AMM) for token swaps with liquidity pools and yield farming capabilities.",
    language: "Puya (Python)",
    deployments: 654,
    icon: GitBranch,
    tags: ["DeFi", "DEX"],
  },
  {
    id: 4,
    name: "Multi-Sig Wallet",
    description: "Secure multi-signature wallet contract with customizable approval thresholds and time locks.",
    language: "TealScript",
    deployments: 543,
    icon: Shield,
    tags: ["Security", "Wallet"],
  },
  {
    id: 5,
    name: "Staking Protocol",
    description: "Flexible staking contract with reward distribution, lock periods, and governance integration.",
    language: "Puya (TypeScript)",
    deployments: 421,
    icon: Zap,
    tags: ["DeFi", "Staking"],
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute top-20 right-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="container relative px-4 py-24 md:py-32 lg:py-40">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-balance">
                  Playground
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl text-pretty max-w-2xl">
                  The ultimate platform to showcase, deploy, and share your Algorand smart contracts with the world.
                  Build your portfolio, connect with developers, and bring your blockchain innovations to life.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="gap-2 glow-teal" asChild>
                  <Link href="/deploy">
                    Showcase Your Contract
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contracts">Explore Showcase</Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-8 pt-4">
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-primary">1,200+</div>
                  <div className="text-sm text-muted-foreground">Showcased Contracts</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Deployments</div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-primary">15K+</div>
                  <div className="text-sm text-muted-foreground">Developers</div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative aspect-square">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/algorand-logo.png"
                    alt="Algorand Logo"
                    width={400}
                    height={400}
                    className="glow-teal-strong"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Popular Smart Contracts Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Featured Showcases</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover innovative smart contracts built and shared by our community
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popularContracts.map((contract, index) => {
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

                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {contract.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-primary/30 text-primary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {contract.deployments.toLocaleString()} deploys
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="flex justify-center pt-8">
            <Button variant="outline" size="lg" asChild>
              <Link href="/contracts" className="gap-2">
                View All Showcases
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden border-t border-border/50">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="container relative px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to showcase your work?</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of developers sharing their smart contracts on Playground
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button size="lg" asChild className="glow-teal">
                <Link href="/deploy" className="gap-2">
                  Start Showcasing
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contracts">Browse Showcases</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
