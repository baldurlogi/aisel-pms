import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiUrl = process.env.API_URL;
    const res = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Login failed:', errorText);
      return new NextResponse('Invalid credentials', { status: 401 });
    }

    const { access_token, refresh_token, user_id } = await res.json();
    console.log('Access token received:', access_token);

    const response = NextResponse.json({ success: true });

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'auth_token',
      value: access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    response.cookies.set({
      name: 'refresh_token',
      value: refresh_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    response.cookies.set({
      name: 'user_id',
      value: user_id,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
