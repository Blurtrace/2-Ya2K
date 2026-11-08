import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  verifyPassword,
  createSessionToken,
  COOKIE_NAME,
  checkRateLimit,
  recordFailedAttempt,
  resetAttempts,
} from '@/server/authConfig';

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // 1. Verificación de tasa de intentos (Brute-force protection)
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Demasiados intentos fallidos. Por seguridad, espera ${rateCheck.retryAfterSeconds} segundos.`,
        },
        { status: 429 }
      );
    }

    // 2. Extracción de contraseña
    const body = await request.json().catch(() => ({}));
    const rawPassword = body.password;

    if (!rawPassword || typeof rawPassword !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Introduce la contraseña.' },
        { status: 400 }
      );
    }

    // 3. Verificación criptográfica en el servidor
    const isMatch = verifyPassword(rawPassword);

    if (!isMatch) {
      recordFailedAttempt(ip);
      const updatedCheck = checkRateLimit(ip);
      return NextResponse.json(
        {
          success: false,
          error: 'Contraseña incorrecta. Inténtalo de nuevo.',
          remainingAttempts: updatedCheck.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 4. Éxito: generar token de sesión y cookie HttpOnly segura
    resetAttempts(ip);
    const token = createSessionToken();

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 días
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor al verificar acceso.' },
      { status: 500 }
    );
  }
}
