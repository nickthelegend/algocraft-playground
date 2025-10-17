import { getSupabaseBrowserClient } from "./supabase"

export async function uploadProjectFiles(projectId: string, files: File[]) {
  const supabase = getSupabaseBrowserClient()
  const uploadPromises = files.map(async (file) => {
    const filePath = `projects/${projectId}/${file.name}`
    
    const { data, error } = await supabase.storage
      .from('project-files')
      .upload(filePath, file)
    
    if (error) throw error
    return data
  })
  
  return Promise.all(uploadPromises)
}

export async function getProjectFiles(projectId: string) {
  const supabase = getSupabaseBrowserClient()
  
  const { data, error } = await supabase.storage
    .from('project-files')
    .list(`projects/${projectId}`)
  
  if (error) throw error
  return data
}

export async function downloadProjectFile(projectId: string, fileName: string) {
  const supabase = getSupabaseBrowserClient()
  
  const { data, error } = await supabase.storage
    .from('project-files')
    .download(`projects/${projectId}/${fileName}`)
  
  if (error) throw error
  return data
}

export function getProjectFileUrl(projectId: string, fileName: string) {
  const supabase = getSupabaseBrowserClient()
  
  const { data } = supabase.storage
    .from('project-files')
    .getPublicUrl(`projects/${projectId}/${fileName}`)
  
  return data.publicUrl
}