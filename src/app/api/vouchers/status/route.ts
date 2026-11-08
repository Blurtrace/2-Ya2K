import { NextResponse } from 'next/server';
import { getVoucherStatus } from '@/server/vouchers/voucherStore';

export async function GET() {
  try {
    const status = getVoucherStatus();
    return NextResponse.json({
      success: true,
      ...status,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al consultar el estado de los vouchers.' },
      { status: 500 }
    );
  }
}
