import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
  // Call NestJS backend logout endpoint to clear refresh token in DB
  const backendRes = await fetch('http://localhost:4000/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!backendRes.ok) {
    const error = await backendRes.text();
    return new NextResponse(error, { status: backendRes.status });
  }

  // Clear cookie on client side
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return response;
}
