'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PublishDebugPage() {
  const [shares, setShares] = useState<any[]>([])
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    supabase
      .from('publish_shares')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        setShares(data || [])
      })
  }, [supabase])

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-6">Publish Debug - Recent Shares</h1>
      <div className="space-y-4">
        {shares.map((share) => (
          <Card key={share.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                Share ID: {share.share_id} | Type: {share.template_type}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Files:</p>
                <pre className="bg-muted p-4 rounded text-xs overflow-auto max-h-96">
                  {JSON.stringify(share.code, null, 2)}
                </pre>
              </div>
              <div className="flex gap-4 text-sm">
                <span>Created: {new Date(share.created_at).toLocaleString()}</span>
                <span>Expires: {new Date(share.expires_at).toLocaleString()}</span>
              </div>
              <a 
                href={`/publish/${share.share_id}`}
                className="text-primary hover:underline text-sm"
              >
                Open Publish Form →
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
