import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Fecha y hora objetivo de liberación: 10 de noviembre de 2026, 00:00:00 hora de Colombia (Bogotá, UTC-5)
export const TARGET_TIMESTAMP_MS = Date.parse('2026-11-10T00:00:00-05:00');
export const PREVIEW_SECRET = '91588493564949657603';
export const PREVIEW_COOKIE_NAME = 'ecos_y2k_preview';

/**
 * Middleware de protección de acceso global a nivel de Edge / Servidor.
 * Bloquea el acceso al aplicativo principal (/) hasta la medianoche del 10 de noviembre (Hora Colombia).
 * Redirige automáticamente a /countdown antes de esa hora, y a / una vez cumplida la fecha.
 * Cuenta con un parámetro secreto (?preview=jandy2026) para que Jandy pueda verificar el despliegue.
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Manejo de bypass secreto de desarrollador/preview
  const previewParam = searchParams.get('preview');
  const previewCookie = request.cookies.get(PREVIEW_COOKIE_NAME)?.value;
  const isPreviewAuthorized = previewCookie === PREVIEW_SECRET || previewParam === PREVIEW_SECRET;

  const now = Date.now();
  const isUnlocked = now >= TARGET_TIMESTAMP_MS;

  // Si se envió el parámetro correcto de preview, registrar la cookie y redirigir al escritorio
  if (previewParam === PREVIEW_SECRET) {
    const targetUrl = request.nextUrl.clone();
    targetUrl.searchParams.delete('preview');
    targetUrl.pathname = '/';
    const response = NextResponse.redirect(targetUrl);
    response.cookies.set(PREVIEW_COOKIE_NAME, PREVIEW_SECRET, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 días
    });
    return response;
  }

  // 2. Si el sistema ya está desbloqueado (llegó el 10 de noviembre) O cuenta con cookie de preview:
  if (isUnlocked || isPreviewAuthorized) {
    // Si intenta ir a /countdown cuando ya está desbloqueado, redirigir automáticamente a /
    if (pathname === '/countdown') {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = '/';
      return NextResponse.redirect(homeUrl);
    }
    return NextResponse.next();
  }

  // 3. Si aún está bloqueado (antes del 10 de noviembre):
  // Si ya se encuentra en /countdown, permitir visualizar la cuenta regresiva
  if (pathname === '/countdown') {
    return NextResponse.next();
  }

  // Para cualquier otra ruta del aplicativo (/), redirigir obligatoriamente a /countdown
  const countdownUrl = request.nextUrl.clone();
  countdownUrl.pathname = '/countdown';
  return NextResponse.redirect(countdownUrl);
}

// Excluir del middleware archivos estáticos, chunks de Next.js, api/time y assets multimedia
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/time|icons|guides|photos|songs|games|robots.txt).*)',
  ],
};
