import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/dashboard', '/patients', '/admin'];

export async function middleware(req: NextRequest) {
  console.log('🔒 Middleware triggered for:', req.nextUrl.pathname);
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // 1. Allow public routes immediately
  if (!PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 2. Check if the auth cookie exists (must match your cookie name exactly)
  const authToken = req.cookies.get('auth_token')?.value;
  const refreshToken = req.cookies.get('refresh_token')?.value;
  const userId = req.cookies.get('user_id')?.value;
  if (!authToken || !refreshToken || !userId) {
    // No auth cookie → redirect to login
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 3. Call backend refresh to validate session
  try {
    const refreshRes = await fetch('http://localhost:4000/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: req.headers.get('cookie') ?? '', // forward all cookies
      },
      credentials: 'include',
    });

    if (refreshRes.ok) {
      // Session valid → allow access
      return NextResponse.next();
    } else {
      // Refresh failed → redirect to login
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error('Error validating refresh token:', error);
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

// 4. Define matcher for protected routes
export const config = {
  matcher: ['/:path*'],
};
