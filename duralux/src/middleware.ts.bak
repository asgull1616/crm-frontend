import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isLoggedIn =
    request.cookies.get('loggedIn')?.value === 'true'

  const { pathname } = request.nextUrl

  if (!isLoggedIn && pathname === '/') {
    return NextResponse.redirect(
      new URL('/authentication/login/minimal', request.url)
    )
  }

  return NextResponse.next()
}
