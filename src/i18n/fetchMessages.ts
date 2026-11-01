import { dictionaryEs } from './dictionaries/es';
import { dictionaryEn } from './dictionaries/en';

export type SupportedLang = 'es' | 'en';

export type FetchMessagesResult = {
  lang: SupportedLang;
  messages: Record<string, string>;
  isFallback: boolean;
};

/**
 * Solicita los mensajes traducidos al endpoint interno /api/i18n (que hace de proxy con n8n).
 * Si n8n tarda más de 3 segundos, responde con error o está inactivo, activa el respaldo local.
 */
export const fetchMessages = async (lang: SupportedLang): Promise<FetchMessagesResult> => {
  const localFallback = lang === 'es' ? dictionaryEs : dictionaryEn;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch('/api/i18n', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lang }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { lang, messages: localFallback, isFallback: true };
    }

    const data = await response.json();
    if (data && typeof data.messages === 'object') {
      // Mezcla los mensajes recibidos sobre el diccionario base para asegurar completitud
      return {
        lang,
        messages: { ...localFallback, ...data.messages },
        isFallback: Boolean(data.isFallback),
      };
    }

    return { lang, messages: localFallback, isFallback: true };
  } catch {
    // Si hay error de red o timeout
    return { lang, messages: localFallback, isFallback: true };
  }
};

