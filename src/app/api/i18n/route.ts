import { NextResponse } from 'next/server';
import { dictionaryEs } from '@/i18n/dictionaries/es';
import { dictionaryEn } from '@/i18n/dictionaries/en';

/**
 * Route Handler /api/i18n
 * Actúa como proxy seguro del lado del servidor hacia el webhook de n8n.
 * Protege la URL del webhook de ser expuesta al navegador.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lang = body?.lang === 'en' ? 'en' : 'es';
    const fallback = lang === 'es' ? dictionaryEs : dictionaryEn;

    const useN8n = process.env.USE_N8N === 'true';
    const webhookUrl = process.env.N8N_I18N_WEBHOOK_URL;

    // Si n8n está deshabilitado o no está configurada la URL, responder con el fallback local
    if (!useN8n || !webhookUrl) {
      return NextResponse.json({
        lang,
        messages: fallback,
        isFallback: true,
      });
    }

    // Intento de conexión con el webhook de n8n con timeout de 3 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const n8nResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lang, keys: body?.keys }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!n8nResponse.ok) {
        return NextResponse.json({
          lang,
          messages: fallback,
          isFallback: true,
        });
      }

      const data = await n8nResponse.json();

      return NextResponse.json({
        lang,
        messages: data?.messages ?? fallback,
        isFallback: false,
      });
    } catch {
      clearTimeout(timeoutId);
      return NextResponse.json({
        lang,
        messages: fallback,
        isFallback: true,
      });
    }
  } catch {
    return NextResponse.json(
      { lang: 'es', messages: dictionaryEs, isFallback: true },
      { status: 400 }
    );
  }
}

