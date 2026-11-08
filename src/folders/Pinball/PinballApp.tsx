'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useOs } from '@/os/state/OsContext';
import { useT } from '@/i18n/I18nContext';

const PINBALL_URL = 'https://alula.github.io/SpaceCadetPinball/';

/**
 * Componente de 3D Pinball: Space Cadet para ECOS 98.
 * Carga el motor original de C++ descompilado y compilado a WebAssembly (WASM).
 * Mantiene la fidelidad absoluta al juego original de Windows 98 / XP.
 */
export const PinballApp = () => {
  const { dispatch } = useOs();
  const { t } = useT();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<'juego' | 'opciones' | 'ayuda' | null>(null);
  const [showControlsDialog, setShowControlsDialog] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Reiniciar juego
  const handleRestart = () => {
    setIsLoading(true);
    setIframeKey((k) => k + 1);
  };

  // Enfocar el juego al hacer clic
  const handleFocusGame = () => {
    if (iframeRef.current) {
      iframeRef.current.focus();
    }
  };

  // Alternar pantalla completa
  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  useEffect(() => {
    // Intentar enfocar el iframe una vez cargado
    if (!isLoading && iframeRef.current) {
      iframeRef.current.focus();
    }
  }, [isLoading]);

  return (
    <div
      onClick={() => openMenu && setOpenMenu(null)}
      className="flex flex-col w-full h-full bg-[#C0C0C0] select-none text-black font-sans relative overflow-hidden"
    >
      {/* Barra de menú superior clásica de Windows 98 */}
      <div className="bg-[#C0C0C0] text-black text-[11px] flex items-center px-1 border-b border-[#808080] select-none relative z-30">
        {/* Menú Juego */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenu(openMenu === 'juego' ? null : 'juego');
            }}
            className={`px-2 py-0.5 hover:bg-[#000080] hover:text-white ${
              openMenu === 'juego' ? 'bg-[#000080] text-white' : ''
            }`}
          >
            <span className="underline">{t('menu.game').charAt(0)}</span>{t('menu.game').slice(1)}
          </button>
          {openMenu === 'juego' && (
            <div
              className="absolute top-full left-0 bg-[#C0C0C0] win-raised shadow-md py-1 min-w-[170px] z-50 text-black text-[11px]"
              onClick={() => setOpenMenu(null)}
            >
              <button
                type="button"
                onClick={handleRestart}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex justify-between"
              >
                <span>{t('menu.newGame')}</span>
                <span className="text-gray-500 hover:text-white">F2</span>
              </button>
              <button
                type="button"
                onClick={handleFullscreen}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
              >
                {t('menu.fullscreen')}
              </button>
              <div className="h-[1px] bg-gray-400 my-1 mx-1" />
              <button
                type="button"
                onClick={() => dispatch({ type: 'CLOSE', id: 'pinball' })}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
              >
                {t('menu.exit')}
              </button>
            </div>
          )}
        </div>

        {/* Menú Opciones */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenu(openMenu === 'opciones' ? null : 'opciones');
            }}
            className={`px-2 py-0.5 hover:bg-[#000080] hover:text-white ${
              openMenu === 'opciones' ? 'bg-[#000080] text-white' : ''
            }`}
          >
            <span className="underline">{t('menu.options').charAt(0)}</span>{t('menu.options').slice(1)}
          </button>
          {openMenu === 'opciones' && (
            <div
              className="absolute top-full left-0 bg-[#C0C0C0] win-raised shadow-md py-1 min-w-[190px] z-50 text-black text-[11px]"
              onClick={() => setOpenMenu(null)}
            >
              <button
                type="button"
                onClick={() => setShowControlsDialog(true)}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
              >
                {t('pinball.controls')}
              </button>
              <button
                type="button"
                onClick={handleRestart}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
              >
                {t('pinball.restart')}
              </button>
            </div>
          )}
        </div>

        {/* Menú Ayuda */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenu(openMenu === 'ayuda' ? null : 'ayuda');
            }}
            className={`px-2 py-0.5 hover:bg-[#000080] hover:text-white ${
              openMenu === 'ayuda' ? 'bg-[#000080] text-white' : ''
            }`}
          >
            <span className="underline">{t('menu.help').charAt(0)}</span>{t('menu.help').slice(1)}
          </button>
          {openMenu === 'ayuda' && (
            <div
              className="absolute top-full left-0 bg-[#C0C0C0] win-raised shadow-md py-1 min-w-[170px] z-50 text-black text-[11px]"
              onClick={() => setOpenMenu(null)}
            >
              <button
                type="button"
                onClick={() => setShowControlsDialog(true)}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
              >
                {t('pinball.controls')}
              </button>
              <div className="h-[1px] bg-gray-400 my-1 mx-1" />
              <button
                type="button"
                onClick={() => setShowAboutDialog(true)}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
              >
                {t('pinball.about')}
              </button>
            </div>
          )}
        </div>

        {/* Botón de foco rápido */}
        <button
          type="button"
          onClick={handleFocusGame}
          className="ml-auto mr-1 px-1.5 py-0.5 win-button text-[10px] flex items-center space-x-1"
          title={t('pinball.focusKeyboardTitle')}
        >
          <span>🎯</span>
          <span>{t('pinball.focusKeyboard')}</span>
        </button>
      </div>

      {/* Contenedor hundido con la pantalla original del juego */}
      <div
        className="flex-1 relative bg-black win-sunken overflow-hidden flex items-center justify-center cursor-default"
        onClick={handleFocusGame}
      >
        {/* Pantalla de carga retro mientras WebAssembly descarga los assets originales */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#000040] flex flex-col items-center justify-center p-4 text-white z-20 select-none">
            <Image
              src="/icons/pinball.png"
              alt=""
              width={48}
              height={48}
              className="pixelated animate-bounce mb-3"
            />
            <p className="text-[13px] font-bold tracking-wide mb-1 text-yellow-300">
              3D Pinball for Windows - Space Cadet
            </p>
            <p className="text-[11px] text-gray-300 mb-4 animate-pulse">
              {t('pinball.loading')}
            </p>
            <div className="w-[180px] h-[14px] win-sunken bg-white p-[1px] relative overflow-hidden">
              <div className="h-full bg-[#000080] animate-pulse w-full" />
            </div>
          </div>
        )}

        {/* Iframe del motor original SpaceCadetPinball */}
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={PINBALL_URL}
          title="3D Pinball: Space Cadet"
          onLoad={() => setIsLoading(false)}
          className="w-full h-full border-0 block bg-black"
          allow="autoplay; fullscreen; gamepad; focus-without-user-activation *"
          scrolling="no"
        />
      </div>

      {/* Barra de estado inferior clásica */}
      <div className="bg-[#C0C0C0] text-black text-[11px] h-[22px] px-2 flex items-center justify-between border-t border-[#808080] select-none font-sans">
        <div className="flex items-center space-x-2 truncate">
          <span className="font-bold text-[#000080]">{t('games.controls')}:</span>
          <span className="text-[#333] truncate">
            {t('pinball.status')}
          </span>
        </div>
        <div className="text-[10px] text-gray-600 flex-shrink-0 font-mono hidden sm:block">
          Original C++ WASM
        </div>
      </div>

      {/* Diálogo de Controles de Pinball */}
      {showControlsDialog && (
        <div
          role="dialog"
          aria-label="Controles de Pinball"
          className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center p-4 select-none"
        >
          <div className="win-raised bg-[#C0C0C0] p-[3px] w-full max-w-[420px] text-black">
            <div className="win-titlebar-active flex items-center justify-between px-1.5 py-0.5 mb-2">
              <span className="text-[11px] font-bold">Controles de 3D Pinball: Space Cadet</span>
              <button
                type="button"
                onClick={() => setShowControlsDialog(false)}
                className="win-button w-4 h-[14px] p-0 font-bold text-[9px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="p-3 text-[11px] leading-relaxed win-sunken bg-white max-h-[320px] overflow-y-auto">
              <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-300">
                <Image
                  src="/icons/pinball.png"
                  alt=""
                  width={32}
                  height={32}
                  className="pixelated"
                />
                <div>
                  <h4 className="font-bold text-[12px]">3D Pinball: Space Cadet</h4>
                  <p className="text-[10px] text-gray-500">Mapeo oficial del motor original de Windows</p>
                </div>
              </div>

              <table className="w-full text-left text-[11px] border-collapse mb-3">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-1 font-bold text-[#000080]">Lanzar la bola:</td>
                    <td className="py-1 font-mono bg-gray-100 px-1.5 rounded">
                      Barra espaciadora (mantener para tensar el resorte)
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-1 font-bold text-[#000080]">Flipper izquierdo:</td>
                    <td className="py-1 font-mono bg-gray-100 px-1.5 rounded">
                      Tecla Z o Clic Izquierdo del ratón
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-1 font-bold text-[#000080]">Flipper derecho:</td>
                    <td className="py-1 font-mono bg-gray-100 px-1.5 rounded">
                      Tecla / (en US) &bull; Tecla - (en ES, junto a Shift Der) &bull; o Clic Derecho del ratón
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-1 font-bold text-[#000080]">Sacudir mesa (Tilt):</td>
                    <td className="py-1 font-mono bg-gray-100 px-1.5 rounded">
                      Tecla X (izq) &bull; Tecla . (der)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 font-bold text-[#000080]">Nueva partida:</td>
                    <td className="py-1 font-mono bg-gray-100 px-1.5 rounded">Tecla F2</td>
                  </tr>
                </tbody>
              </table>

              <div className="bg-blue-50 p-2 border border-blue-200 rounded text-[10px] text-blue-900 space-y-1">
                <p className="font-bold">💡 Consejo para jugar con ratón:</p>
                <p>
                  El motor original de Space Cadet permite jugar cómodamente usando los botones del ratón sobre la mesa:
                  <strong> Clic Izquierdo</strong> para la paleta izquierda y <strong>Clic Derecho</strong> para la paleta derecha.
                </p>
              </div>

              <p className="text-[10px] text-gray-500 italic mt-2">
                Nota: Si las teclas no responden inmediatamente, haz un clic sobre el tablero para enfocar la ventana del juego.
              </p>
            </div>
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => {
                  setShowControlsDialog(false);
                  handleFocusGame();
                }}
                className="win-button win-button-default min-w-[70px] py-0.5 text-[11px] font-bold"
              >
                {t('dialog.ok')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diálogo Acerca de 3D Pinball */}
      {showAboutDialog && (
        <div
          role="dialog"
          aria-label={t('pinball.aboutTitle')}
          className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center p-4 select-none"
        >
          <div className="win-raised bg-[#C0C0C0] p-[3px] w-full max-w-[380px] text-black">
            <div className="win-titlebar-active flex items-center justify-between px-1.5 py-0.5 mb-2">
              <span className="text-[11px] font-bold">{t('pinball.aboutTitle')}</span>
              <button
                type="button"
                onClick={() => setShowAboutDialog(false)}
                className="win-button w-4 h-[14px] p-0 font-bold text-[9px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="p-4 text-[11px] leading-relaxed win-sunken bg-white flex items-start space-x-3">
              <Image
                src="/icons/pinball.png"
                alt=""
                width={40}
                height={40}
                className="pixelated flex-shrink-0"
              />
              <div className="space-y-1.5">
                <h4 className="font-bold text-[12px] text-[#000080]">
                  3D Pinball for Windows - Space Cadet
                </h4>
                <p className="text-[10px] text-gray-600">
                  {t('pinball.aboutDesc')}
                </p>
                <p className="text-[10px] text-gray-500">
                  Port WebAssembly fiel al motor binario original C++ por Andrey Muzychenko (k4zmu2a) y Alula.
                </p>
                <div className="pt-2 text-[10px] font-bold text-gray-700">
                  Integrado en ECOS 98 con amor nostálgico.
                </div>
              </div>
            </div>
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => setShowAboutDialog(false)}
                className="win-button win-button-default min-w-[70px] py-0.5 text-[11px] font-bold"
              >
                {t('dialog.ok')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
