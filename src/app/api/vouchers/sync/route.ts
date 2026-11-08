import { NextResponse } from 'next/server';
import { syncVoucherState } from '@/server/vouchers/voucherStore';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const clientVouchers = Array.isArray(body.redeemedVouchers) ? body.redeemedVouchers : [];

    const updated = syncVoucherState(clientVouchers);

    return NextResponse.json({
      success: true,
      ...updated,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al sincronizar el estado.' },
      { status: 500 }
    );
  }
}
