import { NextResponse } from 'next/server';
import {
  validateVoucherCode,
  checkVoucherRateLimit,
  recordVoucherFailedAttempt,
} from '@/server/vouchers/voucherStore';

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // 1. Límite de tasa
    const rate = checkVoucherRateLimit(ip);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Demasiados intentos. Espera ${rate.retryAfter} segundos.`,
        },
        { status: 429 }
      );
    }

    // 2. Extraer código
    const body = await request.json().catch(() => ({}));
    const code = String(body.code || '').trim();

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Por favor introduce el código del voucher.' },
        { status: 400 }
      );
    }

    // 3. Validar
    const result = await validateVoucherCode(code);

    if (!result.valid) {
      recordVoucherFailedAttempt(ip);
      return NextResponse.json(
        {
          success: false,
          status: result.status,
          error: result.error,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      status: result.status,
      voucherNumber: result.voucherNumber,
      message: '¡Voucher encontrado! Este código es válido y todavía no ha sido utilizado.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor al procesar el código.' },
      { status: 500 }
    );
  }
}
