import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) {
    redirect("/api/oauth/callback")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={user.user_metadata?.avatar_url || user.user_metadata?.picture} 
                  alt={user.email || "User"} 
                />
                <AvatarFallback className="text-2xl">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">
              {user.user_metadata?.full_name || "User Profile"}
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">Email</h3>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">User ID</h3>
                  <p className="text-sm font-mono">{user.id}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">Provider</h3>
                  <Badge variant="secondary">{user.app_metadata?.provider || "email"}</Badge>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">Created</h3>
                  <p className="text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {user.user_metadata && Object.keys(user.user_metadata).length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">Additional Info</h3>
                  <div className="grid gap-2">
                    {Object.entries(user.user_metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-1">
                        <span className="text-sm capitalize">{key.replace(/_/g, " ")}</span>
                        <span className="text-sm text-muted-foreground">
                          {typeof value === "string" ? value : JSON.stringify(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}