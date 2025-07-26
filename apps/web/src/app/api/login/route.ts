import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    console.log('Response status from auth server:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Login failed:', errorText);
      return new NextResponse('Invalid credentials', { status: 401 });
    }

    const { access_token } = await res.json();
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

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
