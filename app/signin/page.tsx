import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import { getSupabaseServerClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SignInPage() {
  const user = await getUser()
  
  if (user) {
    redirect("/")
  }

  async function signInWithGoogle() {
    "use server"
    const supabase = await getSupabaseServerClient()
    const { data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/auth/callback`,
      },
    })
    
    if (data.url) {
      redirect(data.url)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in to access your profile</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={signInWithGoogle}>
          <Button type="submit" className="w-full">
            Sign in with Google
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}