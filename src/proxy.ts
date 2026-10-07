import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/profile', '/orders', '/membership', '/cart', '/favorites'];

const adminRoutes = ['/admin'];

const authRoutes = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authStorage = request.cookies.get('auth-storage')?.value;
  const isAuthenticated = request.cookies.has('access_token');

  let role: string | null = null;

  if (authStorage) {
    try {
      const parsed = JSON.parse(decodeURIComponent(authStorage));
      role = parsed?.state?.user?.role ?? null;
    } catch {
      role = null;
    }
  }

  const isAdmin = role === 'ADMIN';

  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg).*)',
  ],
};