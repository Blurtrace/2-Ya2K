import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';
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

    const filePath = path.join(process.cwd(), 'src', 'server', 'songs', 'audio', fileName);
    if (!fs.existsSync(filePath)) {
      return new NextResponse('Archivo de audio no disponible en el servidor.', {
        status: 404,
      });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = request.headers.get('range');

    // 3. Soporte para streaming con cabeceras HTTP Range (necesario para audio interactivo)
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        return new NextResponse(null, {
          status: 416,
          headers: { 'Content-Range': `bytes */${fileSize}` },
        });
      }

      const chunkSize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });
      const webStream = Readable.toWeb(fileStream);

      return new NextResponse(webStream as ReadableStream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        },
      });
    }

    // Solicitud estándar sin rango
    const fileStream = fs.createReadStream(filePath);
    const webStream = Readable.toWeb(fileStream);

    return new NextResponse(webStream as ReadableStream, {
      status: 200,
      headers: {
        'Accept-Ranges': 'bytes',
        'Content-Length': fileSize.toString(),
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    });
  } catch {
    return new NextResponse('Error interno al servir audio.', { status: 500 });
  }
}
