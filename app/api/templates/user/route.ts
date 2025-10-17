import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await getSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('templates')
    .select('id, slug, title, description, template_type, views, likes, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const templates = (data || []).map(template => ({
    id: template.id,
    slug: template.slug,
    title: template.title,
    description: template.description,
    templateType: template.template_type,
    views: template.views,
    likes: template.likes,
    createdAt: template.created_at
  }))

  return NextResponse.json({ templates })
}
