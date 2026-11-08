import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME, verifySessionToken } from '@/server/authConfig';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    const isValid = verifySessionToken(token);
    return NextResponse.json({ authenticated: isValid });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
