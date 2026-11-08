import { NextResponse } from 'next/server';
import { getSpecialPrize } from '@/server/vouchers/voucherStore';

export async function GET() {
  try {
    const result = getSpecialPrize();

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      prize: result.prize,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error al consultar el premio especial.' },
      { status: 500 }
    );
  }
}
