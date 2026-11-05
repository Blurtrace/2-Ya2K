'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { GameItem } from './gamesData';
import { useRuffle } from './useRuffle';
import { useT } from '@/i18n/I18nContext';

type GamePlayerProps = {
  game: GameItem;
  onBack: () => void;
};

/**
 * Reproductor de videojuegos retro para ECOS 98.
 * Diseñado con estética pura de Windows 98.
 * Prioriza versiones oficiales HTML5 en pantalla limpia y admite emulación Flash con Ruffle.
 */
export const GamePlayer = ({ game, onBack }: GamePlayerProps) => {
  const { lang, t } = useT();
  const { isReady: isRuffleReady, isLoading: isRuffleLoading } = useRuffle();

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Si el juego tiene versión HTML5 verificada, entra en modo web; de lo contrario en Ruffle
  const [mode, setMode] = useState<'web' | 'ruffle'>(game.hasHtml5 && game.webUrl ? 'web' : 'ruffle');
  const [localSwfUrl, setLocalSwfUrl] = useState<string | null>(null);
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const activeSwf = localSwfUrl || game.swfUrl;
  const gameTitle = lang === 'en' ? game.titleEn : game.title;
  const gameControls = lang === 'en' ? game.controlsEn : game.controls;

  // Montaje de Ruffle solo cuando se activa el modo 'ruffle'
  useEffect(() => {
    if (mode !== 'ruffle') return;
    if (!isRuffleReady || !containerRef.current) return;

    setLoadError(null);
    const container = containerRef.current;
    container.innerHTML = '';
    mountRuffle(container, activeSwf);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [mode, isRuffleReady, activeSwf]);

  const mountRuffle = (container: HTMLDivElement, swfUrl: string) => {
    try {
      const ruffle = window.RufflePlayer?.newest ? window.RufflePlayer.newest() : null;
      if (!ruffle) {
        setLoadError('El motor Ruffle no está disponible.');
        return;
      }

      const player = ruffle.createPlayer();
      player.style.width = '100%';
      player.style.height = '100%';
      player.style.backgroundColor = '#000000';
      container.innerHTML = '';
      container.appendChild(player);

      player
        .load({
          url: swfUrl,
          letterbox: 'on',
          scale: 'showAll',
          quality: 'high',
          allowScriptAccess: true,
        })
        .catch((err: unknown) => {
          console.warn('Error al cargar archivo SWF local:', err);
          setLoadError(
            `Error al inicializar el archivo SWF: ${err instanceof Error ? err.message : 'Incompatible'}`
          );
        });
    } catch (e: unknown) {
      console.error('Error montando reproductor:', e);
      setLoadError('Error al crear instancia de Ruffle.');
    }
  };

  const handleRestart = () => {
    if (mode === 'web' && iframeRef.current && game.webUrl) {
      setIsIframeLoading(true);
      // Forzar recarga limpia del iframe
      iframeRef.current.src = game.webUrl;
    } else if (mode === 'ruffle' && containerRef.current) {
      const player = containerRef.current.querySelector('ruffle-player') as HTMLElement & {
        load?: (cfg: { url: string }) => Promise<void>;
      };
      if (player?.load) {
        player.load({ url: activeSwf });
      }
    }
  };

  const handleToggleFullscreen = () => {
    const targetElement = mode === 'web' ? iframeRef.current : containerRef.current;
    if (!targetElement) return;

    if (!document.fullscreenElement) {
      targetElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleLoadCustomSwf = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setLocalSwfUrl(objectUrl);
      setMode('ruffle');
      setLoadError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith('.swf') || file.type.includes('flash'))) {
      const objectUrl = URL.createObjectURL(file);
      setLocalSwfUrl(objectUrl);
      setMode('ruffle');
      setLoadError(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#C0C0C0] text-black select-none">
      {/* Barra de herramientas superior retro de Windows 98 */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-[#808080] bg-[#C0C0C0] text-[11px] gap-1 flex-wrap">
        <div className="flex items-center space-x-1.5">
          {/* Botón Volver al catálogo */}
          <button
            type="button"
            onClick={onBack}
            className="win-button px-2 py-0.5 font-bold flex items-center space-x-1 cursor-pointer"
          >
            <span>{t('games.back')}</span>
          </button>

          <div className="h-4 w-[2px] border-l border-[#808080] border-r border-[#FFFFFF] mx-0.5" />

          {/* Icono y título del juego activo */}
          <div className="flex items-center space-x-1 font-bold truncate max-w-[240px]">
            <Image
              src={game.icon}
              alt=""
              width={16}
              height={16}
              className="pixelated w-4 h-4 flex-shrink-0"
            />
            <span className="truncate">{gameTitle}</span>
          </div>

          {/* Insignia de motor */}
          {game.hasHtml5 && (
            <span className="bg-[#2ecc71] text-black text-[9px] font-bold px-1.5 py-[1px] border border-[#27ae60]">
              HTML5
            </span>
          )}
        </div>

        {/* Acciones de la ventana del juego */}
        <div className="flex items-center space-x-1">
          {/* Selector de modo si tiene versión Web y además el usuario quiere probar Flash */}
          {game.hasHtml5 && (
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'web' ? 'ruffle' : 'web');
                setLoadError(null);
              }}
              className={`win-button px-1.5 py-0.5 text-[10px] cursor-pointer ${
                mode === 'web' ? 'win-pressed font-bold' : ''
              }`}
              title="Alternar entre versión Web HTML5 y emulador Flash Ruffle"
            >
              {mode === 'web' ? t('games.modeWeb') : t('games.modeRuffle')}
            </button>
          )}

          {/* Botón Reiniciar juego */}
          <button
            type="button"
            onClick={handleRestart}
            className="win-button px-2 py-0.5 cursor-pointer"
            title={t('games.restart')}
          >
            ↻ {t('games.restart')}
          </button>

          {/* Botón Pantalla Completa */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="win-button px-2 py-0.5 cursor-pointer font-bold"
            title={t('games.fullscreen')}
          >
            ⛶
          </button>

          {/* Carga manual de archivo .SWF */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="win-button px-1.5 py-0.5 text-[10px] cursor-pointer"
            title="Cargar un archivo .swf desde tu computadora"
          >
            📁 {t('games.loadSwf')}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".swf"
            onChange={handleLoadCustomSwf}
            className="hidden"
          />
        </div>
      </div>

      {/* Área hundida de visualización: SOLO la pantalla del juego sin barras de navegador externas */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="flex-1 relative bg-black win-sunken overflow-hidden flex items-center justify-center"
      >
        {mode === 'web' && game.hasHtml5 && game.webUrl ? (
          /* MODO HTML5 LIMPIO: Renderiza exclusivamente la pantalla del juego en el canvas */
          <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
            {isIframeLoading && (
              <div className="absolute inset-0 bg-[#008080] flex flex-col items-center justify-center p-4 text-white z-10">
                <Image
                  src="/icons/hourglass.png"
                  alt=""
                  width={32}
                  height={32}
                  className="pixelated animate-pulse mb-3"
                />
                <p className="text-[12px] font-bold mb-1">Cargando juego HTML5...</p>
                <p className="text-[10px] opacity-80">{gameTitle}</p>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={game.webUrl}
              title={gameTitle}
              onLoad={() => setIsIframeLoading(false)}
              className="w-full h-full border-0 block"
              allow="autoplay; fullscreen; keyboard"
              sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
              scrolling="no"
            />
          </div>
        ) : (
          /* MODO FLASH / SIN VERSIÓN HTML5 DISPONIBLE */
          <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
            {isRuffleLoading && !loadError && (
              <div className="absolute inset-0 bg-[#008080] flex flex-col items-center justify-center p-4 text-white z-10">
                <Image
                  src="/icons/hourglass.png"
                  alt=""
                  width={32}
                  height={32}
                  className="pixelated animate-pulse mb-3"
                />
                <p className="text-[12px] font-bold mb-1">{t('games.loadingRuffle')}</p>
                <p className="text-[10px] opacity-80">{gameTitle}</p>
              </div>
            )}

            {loadError && (
              <div className="absolute inset-0 bg-[#000000] text-white flex flex-col items-center justify-center p-4 text-center z-20">
                <div className="win-raised bg-[#C0C0C0] text-black p-4 max-w-[440px] text-left">
                  <div className="font-bold text-[12px] mb-2 flex items-center space-x-1.5 text-[#870000]">
                    <span>⚠</span>
                    <span>Versión no disponible</span>
                  </div>
                  <p className="text-[11px] mb-3 leading-relaxed">
                    {loadError}
                  </p>
                  <p className="text-[10px] text-[#555] mb-3">
                    Puedes jugar arrastrando un archivo <strong>.swf</strong> propio a esta ventana o seleccionándolo con el botón inferior.
                  </p>
                  <div className="flex gap-2 justify-end flex-wrap">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="win-button px-3 py-1 text-[11px] font-bold cursor-pointer"
                    >
                      📁 Cargar archivo .swf
                    </button>
                    <button
                      type="button"
                      onClick={onBack}
                      className="win-button px-3 py-1 text-[11px] cursor-pointer"
                    >
                      {t('folder.back')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Contenedor donde se inserta el emulador Ruffle si hay un SWF local cargado */}
            <div ref={containerRef} className="w-full h-full flex items-center justify-center" />
          </div>
        )}
      </div>

      {/* Barra de estado inferior clásica */}
      <div className="win-sunken bg-[#C0C0C0] px-2 py-1 text-[11px] flex items-center justify-between">
        <div className="flex items-center space-x-2 truncate">
          <span className="font-bold text-[#000080]">🎮 {t('games.controls')}:</span>
          <span className="text-[#333333] truncate">{gameControls}</span>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0 text-[10px] text-[#555]">
          <span>{mode === 'web' ? 'Motor: HTML5 Canvas' : 'Motor: Ruffle WASM'}</span>
        </div>
      </div>
    </div>
  );
};
