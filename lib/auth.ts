"use server"

import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "./supabase-server"

export async function getUser() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export async function signOut() {
  const supabase = await getSupabaseServerClient()
  await supabase.auth.signOut()
  redirect("/")
}
