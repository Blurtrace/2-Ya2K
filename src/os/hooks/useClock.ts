import { useState, useEffect } from 'react';
import type { SupportedLang } from '@/i18n/fetchMessages';

/**
 * Hook para el reloj de la bandeja del sistema (HH:MM).
 * Seguro contra desincronización de hidratación del SSR.
 */
export const useClock = (lang: SupportedLang): string => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const formatTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
        setTimeString(formatter.format(new Date()));
      } catch {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        setTimeString(`${hours}:${minutes}`);
      }
    };

    formatTime();
    const interval = setInterval(formatTime, 1000);
    return () => clearInterval(interval);
  }, [lang]);

  return timeString;
};

