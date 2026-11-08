import { NextResponse } from 'next/server';
import { getSpecialPrizeForClient } from '@/server/vouchers/voucherStore';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const currentRedeemed = Array.isArray(body.currentRedeemed) ? body.currentRedeemed : [];

    const result = getSpecialPrizeForClient(currentRedeemed);

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const redeemedParam = searchParams.get('redeemed');
    const clientRedeemed = redeemedParam ? redeemedParam.split(',') : [];

    const result = getSpecialPrizeForClient(clientRedeemed);

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
