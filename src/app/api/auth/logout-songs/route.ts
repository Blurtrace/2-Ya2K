import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME } from '@/server/authConfig';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
