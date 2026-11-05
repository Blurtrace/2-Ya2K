'use client';

import { useState, useEffect } from 'react';

// Declaración global para TypeScript del objeto que inyecta Ruffle
declare global {
  interface Window {
    RufflePlayer?: {
      config?: Record<string, unknown>;
      newest?: () => {
        createPlayer: () => HTMLElement & {
          load: (config: {
            url: string;
            letterbox?: 'on' | 'off' | 'fullscreen';
            scale?: 'showAll' | 'exactFit' | 'noBorder' | 'noScale';
            quality?: 'low' | 'medium' | 'high' | 'best';
            allowScriptAccess?: boolean;
          }) => Promise<void>;
          pause?: () => void;
          play?: () => void;
        };
      };
      [key: string]: unknown;
    };
  }
}

/**
 * Hook para cargar de forma asíncrona y segura la librería Ruffle (WebAssembly).
 * Permite emular cualquier archivo SWF en navegadores modernos sin Flash nativo.
 */
export const useRuffle = () => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Si ya existe en window, marcamos como listo de inmediato
    if (window.RufflePlayer) {
      setIsReady(true);
      setIsLoading(false);
      return;
    }

    // Comprobar si ya hay una etiqueta de script en el DOM
    const existingScript = document.querySelector('script[src*="ruffle"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        setIsReady(true);
        setIsLoading(false);
      });
      existingScript.addEventListener('error', () => {
        setError('Error al cargar el script de Ruffle');
        setIsLoading(false);
      });
      return;
    }

    // Configurar Ruffle antes de cargar para arranque inmediato
    window.RufflePlayer = window.RufflePlayer || {};
    (window.RufflePlayer as Record<string, unknown>).config = {
      autoplay: 'on',
      unmuteOverlay: 'hidden',
      splashScreen: false,
      letterbox: 'on',
    };

    // Crear la etiqueta script hacia el CDN oficial de Ruffle
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@ruffle-rs/ruffle';
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      setIsReady(true);
      setIsLoading(false);
    };

    script.onerror = () => {
      setError('No se pudo descargar el emulador Ruffle desde el CDN.');
      setIsLoading(false);
    };

    document.head.appendChild(script);
  }, []);

  return { isReady, isLoading, error };
};

