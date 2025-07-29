import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/dashboard', '/patients', '/admin'];

export async function middleware(req: NextRequest) {
  console.log('🔒 Middleware triggered for:', req.nextUrl.pathname);
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  if (!PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const authToken = req.cookies.get('auth_token')?.value;
  const refreshToken = req.cookies.get('refresh_token')?.value;
  const userId = req.cookies.get('user_id')?.value;

  if (!authToken || !refreshToken || !userId) {
    console.log('🚫 Missing cookies, redirecting to login');
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  console.log('🧪 Validating tokens for user:', userId);
  console.log('🍪 Cookies found:', {
    authToken: authToken?.substring(0, 20) + '...',
    refreshToken: refreshToken?.substring(0, 20) + '...',
    userId,
  });

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    const refreshRes = await fetch(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `refresh_token=${refreshToken}; user_id=${userId}; auth_token=${authToken}`,
      },
    });

    console.log('🔄 Refresh response status:', refreshRes.status);

    const responseText = await refreshRes.text();
    console.log('🔄 Refresh response text:', responseText);

    if (!refreshRes.ok) {
      console.error('❌ Refresh failed:', responseText);
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('💥 Failed parsing refresh response JSON:', parseError);
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    const { access_token, refresh_token: newRefreshToken } = parsedResponse;

    if (!access_token || !newRefreshToken) {
      console.error('⚠️ Missing tokens in refresh response:', parsedResponse);
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    const response = NextResponse.next();
    response.cookies.set({
      name: 'auth_token',
      value: access_token,
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 15,
    });

    response.cookies.set({
      name: 'refresh_token',
      value: newRefreshToken,
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'lax', // Use 'lax' for consistency
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log('✅ Tokens refreshed and cookies updated successfully');
    return response;
  } catch (error) {
    console.error('💥 Unexpected middleware error:', error);
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/patients/:path*', '/admin/:path*', '/patients'],
};
