import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Header } from "@/components/header"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Algorand Developer Portal",
  description: "Everything you need to build solutions powered by the Algorand blockchain network",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <script src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} async defer></script>
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
          <main className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
