'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function PublishPage() {
  const { shareId } = useParams()
  const [code, setCode] = useState<any>(null)
  const [templateType, setTemplateType] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    supabase
      .from('publish_shares')
      .select('*')
      .eq('share_id', shareId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          throw new Error('Share not found or expired')
        }
        console.log('Received code from share:', data)
        setCode(data.code)
        setTemplateType(data.template_type)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load share:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [shareId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/signin?redirect=/publish')
      return
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const id = crypto.randomUUID()

    const { error: insertError } = await supabase.from('templates').insert({
      id,
      slug,
      title,
      description,
      template_type: templateType,
      code,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })

    if (insertError) {
      console.error('Insert error:', insertError)
      alert('Failed to publish: ' + insertError.message)
      setSubmitting(false)
      return
    }

    router.push(`/templates/${slug}`)
  }

  if (loading) return <div className="container py-8">Loading code...</div>
  if (error) return <div className="container py-8">Error: {error}</div>
  if (!code) return <div className="container py-8">No code found</div>

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Publish Template</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} />
            </div>
            <div>
              <Label>Template Type</Label>
              <Input value={templateType} disabled />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Publishing...' : 'Publish'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
