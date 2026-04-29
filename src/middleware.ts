import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const ADMIN_ROUTES = ['/admin'];
const AUTH_ROUTES = ['/orders', '/cart', '/checkout'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check protected page routes
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));

  if (!isAdminRoute && !isAuthRoute) return NextResponse.next();

  // Try to get token from cookie (for SSR page navigation)
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const payload = verifyToken(token);

    if (isAdminRoute && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/orders/:path*', '/cart', '/checkout/:path*'],
};
