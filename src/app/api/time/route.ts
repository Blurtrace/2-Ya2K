import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Fecha y hora objetivo: 10 de noviembre de 2026, 00:00:00 COT (Bogotá, UTC-5)
const TARGET_TIMESTAMP_MS = Date.parse('2026-11-10T00:00:00-05:00');

export async function GET() {
  const now = Date.now();
  const unlocked = now >= TARGET_TIMESTAMP_MS;

  return NextResponse.json(
    {
      serverTime: now,
      targetTime: TARGET_TIMESTAMP_MS,
      remainingMs: Math.max(0, TARGET_TIMESTAMP_MS - now),
      unlocked,
      timeZone: 'America/Bogota',
      isoTarget: '2026-11-10T00:00:00-05:00',
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    }
  );
}
