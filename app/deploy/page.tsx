import { getUser } from "@/lib/auth"
import { LoginForm } from "@/components/login-form"
import { DeployDashboard } from "@/components/deploy-dashboard"

export default async function DeployPage() {
  const user = await getUser()

  if (!user) {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative">
          <LoginForm />
        </div>
      </main>
    )
  }

  return <DeployDashboard user={user} />
}
