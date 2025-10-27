import { NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await getSupabaseServerClient()
  
  const { data: template, error } = await supabase
    .from('templates')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 })
  }

  await supabase
    .from('templates')
    .update({ views: template.views + 1 })
    .eq('id', template.id)

  const { data: userData } = await supabase
    .from('users')
    .select('username, display_name')
    .eq('id', template.user_id)
    .single()

  return NextResponse.json({
    id: template.id,
    slug: template.slug,
    title: template.title,
    description: template.description,
    templateType: template.template_type,
    code: template.code,
    author: userData?.display_name || userData?.username || 'Anonymous',
    createdAt: template.created_at,
    views: template.views + 1,
    likes: template.likes
  })
}
