import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from('templates')
    .select(`
      id,
      slug,
      title,
      description,
      template_type,
      created_at,
      likes,
      views,
      user_id
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const templatesWithAuthors = await Promise.all(
    (data || []).map(async (template) => {
      const { data: userData } = await supabase
        .from('users')
        .select('username, display_name')
        .eq('id', template.user_id)
        .single()

      return {
        id: template.id,
        slug: template.slug,
        title: template.title,
        description: template.description,
        templateType: template.template_type,
        author: userData?.display_name || userData?.username || 'Anonymous',
        createdAt: template.created_at,
        likes: template.likes,
        views: template.views
      }
    })
  )

  return NextResponse.json({ templates: templatesWithAuthors })
}
