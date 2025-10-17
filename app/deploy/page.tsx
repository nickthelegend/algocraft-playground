import { getUser } from "@/lib/auth"
import { LoginForm } from "@/components/login-form"
import { DeployDashboard } from "@/components/deploy-dashboard"
import { cookies } from "next/headers"

export default async function DeployPage() {
  const user = await getUser()
  const cookieStore = await cookies()
  const deploymentDataCookie = cookieStore.get('deployment-data')
  
  let externalDeployment = null
  if (deploymentDataCookie) {
    try {
      externalDeployment = JSON.parse(deploymentDataCookie.value)
    } catch (error) {
      console.error('Failed to parse deployment data:', error)
    }
  }

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

  return <DeployDashboard user={user} externalDeployment={externalDeployment} />
}
