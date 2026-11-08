import { NextResponse } from 'next/server';
import {
  redeemVoucherCode,
  checkVoucherRateLimit,
  recordVoucherFailedAttempt,
} from '@/server/vouchers/voucherStore';

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

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

    const body = await request.json().catch(() => ({}));
    const code = String(body.code || '').trim();
    const currentRedeemed = Array.isArray(body.currentRedeemed) ? body.currentRedeemed : [];

    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Por favor introduce el código del voucher.' },
        { status: 400 }
      );
    }

    const result = await redeemVoucherCode(code, currentRedeemed);

    if (!result.success) {
      recordVoucherFailedAttempt(ip);
      return NextResponse.json(
        {
          success: false,
          status: result.status,
          error: result.error,
          redeemedCount: result.redeemedCount,
          totalVouchers: result.totalVouchers,
          isAllCompleted: result.isAllCompleted,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      status: result.status,
      voucherNumber: result.voucherNumber,
      redeemedCount: result.redeemedCount,
      totalVouchers: result.totalVouchers,
      isAllCompleted: result.isAllCompleted,
      message: '¡Voucher canjeado correctamente! ♡',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor al canjear el voucher.' },
      { status: 500 }
    );
  }
}
