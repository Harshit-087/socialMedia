import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Define routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings'];
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 2. Safely extract the token from cookies (Edge-compatible)
  // Replace 'auth-token' with whatever your session cookie name is
  const token = request.cookies.get('token')?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Case A: User is trying to access a protected page but has no token
  if (isProtectedRoute && !token) {
    // Capture the page they were trying to visit so we can send them back post-login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    
    return NextResponse.redirect(loginUrl);
  }

  // Case B: User is already logged in but trying to access /login or /register
  if (isAuthRoute && token) {
    // Send them straight to the dashboard or home
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow the request to proceed normally if no rules are violated
  return NextResponse.next();
}

// 3. Optimize middleware execution using a matcher config
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