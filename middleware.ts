import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, allow all requests through
  if (!supabaseUrl || !supabaseAnonKey) {
    return response
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
        response = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Skip username check for certain paths
  const skipPaths = ['/setup-username', '/api/', '/signin', '/_next/', '/favicon.ico']
  const shouldSkip = skipPaths.some(path => request.nextUrl.pathname.startsWith(path))
  
  if (user && !shouldSkip) {
    // Check if user has set up username
    try {
      const checkResponse = await fetch(`${request.nextUrl.origin}/api/setup-username`, {
        headers: {
          'Cookie': request.headers.get('cookie') || ''
        }
      })
      
      if (checkResponse.ok) {
        const { hasUsername } = await checkResponse.json()
        if (!hasUsername) {
          return NextResponse.redirect(new URL('/setup-username', request.url))
        }
      }
    } catch (error) {
      console.error('Error checking username:', error)
    }
  }

  if (request.nextUrl.pathname.startsWith("/deploy") && !user) {
    // Allow the deploy page to render (it will show login form)
    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
