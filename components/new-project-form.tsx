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
import ReCAPTCHA from "react-google-recaptcha"

interface NewProjectFormProps {
  onClose: () => void
  onProjectCreated?: () => void
}

export function NewProjectForm({ onClose, onProjectCreated }: NewProjectFormProps) {
  const [loading, setLoading] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    templateType: "",
    repoUrl: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!recaptchaToken) {
        console.error('reCAPTCHA verification required')
        return
      }

      const response = await fetch('/api/add-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      })

      if (response.ok) {
        onProjectCreated?.()
        onClose()
      } else {
        console.error('Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setLoading(false)
    }
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
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="Token Factory"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            <Label htmlFor="repoUrl">Repository URL (Optional)</Label>
            <Input
              id="repoUrl"
              placeholder="https://github.com/username/repo"
              value={formData.repoUrl}
              onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="templateType">Template Type</Label>
            <Select 
              value={formData.templateType} 
              onValueChange={(value) => setFormData({ ...formData, templateType: value })}
              disabled={!!externalDeployment}
            >
              <SelectTrigger id="templateType" className="bg-secondary/50">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TealScript">TealScript</SelectItem>
                <SelectItem value="PyTeal">PyTeal</SelectItem>
                <SelectItem value="Puya (Python)">Puya (Python)</SelectItem>
                <SelectItem value="Puya (TypeScript)">Puya (TypeScript)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={setRecaptchaToken}
              size="compact"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={loading || !recaptchaToken}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
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
