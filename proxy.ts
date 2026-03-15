import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Define protected and public routes
  const isDashboardRoute = pathname === '/' || pathname.startsWith('/dashboard') || pathname.startsWith('/upload') || pathname.startsWith('/jobs') || pathname.startsWith('/documents') || pathname.startsWith('/settings') || pathname.startsWith('/users');
  const isAuthRoute = pathname === '/login';

  // 1. Redirect to login if accessing protected route without token
  if (isDashboardRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('auth', 'required');
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect to dashboard if accessing auth route with token
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
