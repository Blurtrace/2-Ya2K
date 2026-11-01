'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { SupportedLang } from './fetchMessages';
import { fetchMessages } from './fetchMessages';
import { dictionaryEs } from './dictionaries/es';
import { dictionaryEn } from './dictionaries/en';

type I18nContextValue = {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  isFallback: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'ecos.lang';

/**
 * Obtiene el idioma inicial detectando el navegador o localStorage de manera segura.
 */
const getInitialLang = (): SupportedLang => {
  if (typeof window === 'undefined') return 'es';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'es' || saved === 'en') return saved;
    if (navigator.language && navigator.language.toLowerCase().startsWith('en')) {
      return 'en';
    }
  } catch {
    // Si localStorage no está disponible, ignora silenciosamente
  }
  return 'es';
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<SupportedLang>('es');
  const [messages, setMessages] = useState<Record<string, string>>(dictionaryEs);
  const [isFallback, setIsFallback] = useState(false);

  // Inicialización en cliente
  useEffect(() => {
    const initial = getInitialLang();
    setLangState(initial);
    setMessages(initial === 'es' ? dictionaryEs : dictionaryEn);
    document.documentElement.lang = initial;
  }, []);

  // Actualiza mensajes al cambiar idioma
  useEffect(() => {
    let isCancelled = false;

    // Cambia el atributo del documento HTML
    document.documentElement.lang = lang;

    // Persiste en localStorage
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Manejo seguro sin fallos
    }

    // Consulta el proxy i18n
    fetchMessages(lang).then((result) => {
      if (!isCancelled) {
        setMessages(result.messages);
        setIsFallback(result.isFallback);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [lang]);

  const setLang = useCallback((newLang: SupportedLang) => {
    setLangState(newLang);
  }, []);

  /**
   * Función t() pura para traducción e interpolación de variables {clave}.
   */
  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      let message = messages[key];
      if (!message) {
        // Fallback a inglés o a la propia clave
        message = dictionaryEn[key] || key;
        if (process.env.NODE_ENV === 'development' && !dictionaryEn[key]) {
          console.warn(`[i18n] Clave de traducción no encontrada: "${key}"`);
        }
      }

      if (vars) {
        for (const [varKey, varValue] of Object.entries(vars)) {
          message = message.replaceAll(`{${varKey}}`, String(varValue));
        }
      }

      return message;
    },
    [messages]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t, isFallback }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useT = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useT debe usarse dentro de I18nProvider');
  }
  return context;
};

