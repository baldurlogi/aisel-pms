import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL ?? 'http://localhost:4000';

export async function POST(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie') ?? '';

    const backendRes = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
      cache: 'no-store',
    });

    if (!backendRes.ok) {
      const error = await backendRes.text();
      return new NextResponse(error, { status: backendRes.status });
    }

    const res = NextResponse.json({ message: 'Logged out' }, { status: 200 });

    res.cookies.set({
      name: 'auth_token',
      value: '',
      httpOnly: true,
      path: '/',
      expires: new Date(0),
    });

    return res;
  } catch (err) {
    console.error('Error during logout:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
