import { notFound } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await getSupabaseServerClient()

  const { data: template, error } = await supabase
    .from('templates')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !template) notFound()

  const { data: userData } = await supabase
    .from('users')
    .select('username, name')
    .eq('id', template.user_id)
    .single()

  const ideUrl = process.env.NEXT_PUBLIC_IDE_URL || 'http://localhost:3001'
  const typeMap: Record<string, string> = {
    pyteal: 'pyteal',
    tealscript: 'tealscript',
    puyapy: 'puyapy',
    puyats: 'puyats'
  }
  const templatePath = typeMap[template.template_type.toLowerCase()] || 'pyteal'
  const openInIdeUrl = `${ideUrl}/${templatePath}?template=${slug}`

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>{template.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{template.description}</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>By {userData?.name || userData?.username || 'Anonymous'}</span>
            <span>•</span>
            <span>{template.views} views</span>
            <span>•</span>
            <span>{template.likes} likes</span>
          </div>
          <Button asChild>
            <a href={openInIdeUrl} target="_blank" rel="noopener noreferrer">
              Open in IDE
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
