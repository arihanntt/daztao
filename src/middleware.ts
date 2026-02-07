// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Define the protected path
  const isProtected = path.startsWith('/admin');
  
  // 2. Exclude the login page itself (otherwise infinite loop)
  const isLoginPage = path === '/admin/login';

  // 3. Check for the secret cookie
  const adminCookie = request.cookies.get('daztao_admin_session');

  // LOGIC: If trying to access admin AND not on login page AND no cookie
  if (isProtected && !isLoginPage && !adminCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // LOGIC: If on login page BUT already has cookie, send to dashboard
  if (isLoginPage && adminCookie) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// Configure which paths this runs on
export const config = {
  matcher: ['/admin/:path*'],
};