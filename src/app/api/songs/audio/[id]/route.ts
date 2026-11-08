import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import path from 'path';
import { COOKIE_NAME, verifySessionToken } from '@/server/authConfig';

const AUDIO_FILES_MAP: Record<string, string> = {
  '01': '01-di-que-si.mp3',
  '01-di-que-si': '01-di-que-si.mp3',
  '02': '02-beso-rosalia.mp3',
  '02-beso-rosalia': '02-beso-rosalia.mp3',
  '03': '03-smithereens.mp3',
  '03-smithereens': '03-smithereens.mp3',
  '04': '04-tear-in-my-heart.mp3',
  '04-tear-in-my-heart': '04-tear-in-my-heart.mp3',
  '05': '05-carita-linda.mp3',
  '05-carita-linda': '05-carita-linda.mp3',
  '06': '06-te-encontre.mp3',
  '06-te-encontre': '06-te-encontre.mp3',
  '07': '07-amor-a-primera-vista.mp3',
  '07-amor-a-primera-vista': '07-amor-a-primera-vista.mp3',
  '08': '08-tu-amor-me-hace-bien.mp3',
  '08-tu-amor-me-hace-bien': '08-tu-amor-me-hace-bien.mp3',
  '09': '09-me-gustas-cc.mp3',
  '09-me-gustas-cc': '09-me-gustas-cc.mp3',
  '10': '10-7-palabras.mp3',
  '10-7-palabras': '10-7-palabras.mp3',
  '11': '11-stop-the-world.mp3',
  '11-stop-the-world': '11-stop-the-world.mp3',
  '12': '12-sweater-weather.mp3',
  '12-sweater-weather': '12-sweater-weather.mp3',
  '13': '13-we-fell-in-love-in-october.mp3',
  '13-we-fell-in-love-in-october': '13-we-fell-in-love-in-october.mp3',
  '14': '14-baby-im-yours.mp3',
  '14-baby-im-yours': '14-baby-im-yours.mp3',
  '15': '15-audio-lsd.mp3',
  '15-audio-lsd': '15-audio-lsd.mp3',
  '16': '16-beso-jose-log.mp3',
  '16-beso-jose-log': '16-beso-jose-log.mp3',
  '17': '17-ah-ah-o-no.mp3',
  '17-ah-ah-o-no': '17-ah-ah-o-no.mp3',
};

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verificación de sesión mediante cookie HttpOnly
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!verifySessionToken(token)) {
      return new NextResponse('Acceso denegado: carpeta protegida por contraseña.', {
        status: 401,
      });
    }

    // 2. Extracción y sanitización del identificador
    const { id } = await context.params;
    const cleanId = path.basename(id).replace(/\.mp3$/i, '');
    const fileName = AUDIO_FILES_MAP[cleanId];

    if (!fileName) {
      return new NextResponse('Canción no encontrada.', { status: 404 });
    }

    // 3. Redirección al recurso de audio en public/songs/audio/ servido por Vercel CDN
    // Protegido por sesión: si no está autenticado, la validación previa devuelve 401.
    // Al redirigir, Vercel CDN gestiona el streaming con soporte nativo HTTP 206 (Range)
    // eliminando por completo cualquier restricción de tamaño en funciones Serverless (50 MB).
    return NextResponse.redirect(new URL(`/songs/audio/${fileName}`, request.url));
  } catch {
    return new NextResponse('Error interno al servir audio.', { status: 500 });
  }
}
