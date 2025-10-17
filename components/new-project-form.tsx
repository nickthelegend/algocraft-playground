"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, X } from "lucide-react"

interface NewProjectFormProps {
  onClose: () => void
}

export function NewProjectForm({ onClose }: NewProjectFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    slug: "",
    contractName: "",
    description: "",
    template: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Mock deployment - in production this would deploy to Algorand
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("[v0] New project created:", formData)
    setLoading(false)
    onClose()
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl">Create New Project</CardTitle>
            <CardDescription>Deploy a new smart contract to the Algorand network</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="slug">Project Slug</Label>
            <Input
              id="slug"
              placeholder="my-awesome-contract"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              className="bg-secondary/50"
            />
            <p className="text-xs text-muted-foreground">
              This will be used in your project URL: algorand.dev/projects/{formData.slug || "your-slug"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractName">Smart Contract Name</Label>
            <Input
              id="contractName"
              placeholder="TokenFactory"
              value={formData.contractName}
              onChange={(e) => setFormData({ ...formData, contractName: e.target.value })}
              required
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what your smart contract does..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="min-h-24 bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Template Type</Label>
            <Select value={formData.template} onValueChange={(value) => setFormData({ ...formData, template: value })}>
              <SelectTrigger id="template" className="bg-secondary/50">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tealscript">TealScript</SelectItem>
                <SelectItem value="pyteal">PyTeal</SelectItem>
                <SelectItem value="puyapy">Puya (Python)</SelectItem>
                <SelectItem value="puyats">Puya (TypeScript)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deploying...
                </>
              ) : (
                "Deploy Contract"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
