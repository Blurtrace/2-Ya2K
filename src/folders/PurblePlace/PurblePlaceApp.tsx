'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useOs } from '@/os/state/OsContext';

const PURBLE_PLACE_URL = 'https://playminigames.net/embed/purble-place';

/**
 * Componente oficial de Purble Place para ECOS 98.
 * Carga el juego original de Windows Vista/7 desarrollado por Oberon Media.
 * - Inicia directamente en el "Pueblo Completo".
 * - Incluye los 3 minijuegos oficiales en el mapa interactivo del pueblo:
 *   1. Purble Pairs (La Escuela de memoria a la izquierda)
 *   2. Comfy Cakes (La Pastelería en el centro)
 *   3. Purble Shop (La Tienda de ropa y deducción a la derecha)
 * - Protegido contra publicidad invasiva mediante sandbox estricto.
 */
export const PurblePlaceApp = () => {
  const { dispatch } = useOs();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<'juego' | 'ayuda' | null>(null);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Reiniciar juego
  const handleRestart = () => {
    setIsLoading(true);
    setIframeKey((k) => k + 1);
  };

  // Enfocar iframe
  const handleFocusGame = () => {
    if (iframeRef.current) {
      iframeRef.current.focus();
    }
  };

  // Pantalla completa
  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  useEffect(() => {
    if (!isLoading && iframeRef.current) {
      iframeRef.current.focus();
    }
  }, [isLoading]);

  return (
    <div
      onClick={() => openMenu && setOpenMenu(null)}
      className="flex flex-col w-full h-full bg-[#C0C0C0] select-none text-black font-sans relative overflow-hidden"
    >
      {/* 1. Barra de menú clásica de Windows (Solo Juego y Ayuda) */}
      <div className="bg-[#C0C0C0] text-black text-[11px] flex items-center px-1 border-b border-[#808080] select-none relative z-30">
        {/* Menú Juego */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenu(openMenu === 'juego' ? null : 'juego');
            }}
            className={`px-2 py-0.5 hover:bg-[#000080] hover:text-white cursor-pointer ${
              openMenu === 'juego' ? 'bg-[#000080] text-white' : ''
            }`}
          >
            <span className="underline">J</span>uego
          </button>
          {openMenu === 'juego' && (
            <div
              className="absolute top-full left-0 bg-[#C0C0C0] win-raised shadow-md py-1 min-w-[180px] z-50 text-black text-[11px]"
              onClick={() => setOpenMenu(null)}
            >
              <button
                type="button"
                onClick={handleRestart}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex justify-between cursor-pointer"
              >
                <span>Nueva partida</span>
                <span className="text-gray-500 hover:text-white">F2</span>
              </button>
              <button
                type="button"
                onClick={handleFullscreen}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                Pantalla completa
              </button>
              <div className="h-[1px] bg-gray-400 my-1 mx-1" />
              <button
                type="button"
                onClick={() => dispatch({ type: 'CLOSE', id: 'purble-place' })}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                Salir
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
            className={`px-2 py-0.5 hover:bg-[#000080] hover:text-white cursor-pointer ${
              openMenu === 'ayuda' ? 'bg-[#000080] text-white' : ''
            }`}
          >
            <span className="underline">A</span>yuda
          </button>
          {openMenu === 'ayuda' && (
            <div
              className="absolute top-full left-0 bg-[#C0C0C0] win-raised shadow-md py-1 min-w-[200px] z-50 text-black text-[11px]"
              onClick={() => setOpenMenu(null)}
            >
              <button
                type="button"
                onClick={() => setShowHelpDialog(true)}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                Cómo jugar Purble Place...
              </button>
              <div className="h-[1px] bg-gray-400 my-1 mx-1" />
              <button
                type="button"
                onClick={() => setShowAboutDialog(true)}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                Acerca de Purble Place...
              </button>
            </div>
          )}
        </div>

        {/* Botón de foco para activar controles */}
        <button
          type="button"
          onClick={handleFocusGame}
          className="ml-auto mr-1 win-button px-1.5 py-0.5 text-[10px] flex items-center space-x-1 cursor-pointer"
          title="Activar foco en el juego"
        >
          <span>🎯</span>
          <span>Activar juego</span>
        </button>
      </div>

      {/* 2. Pantalla del Juego Original (Pueblo Completo) */}
      <div
        className="flex-1 relative bg-[#1E0F36] win-sunken overflow-hidden flex items-center justify-center cursor-default"
        onClick={handleFocusGame}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-[#2D1254] flex flex-col items-center justify-center p-4 text-white z-20 select-none">
            <Image
              src="/icons/purble-place.png"
              alt=""
              width={64}
              height={64}
              className="pixelated animate-bounce mb-3"
            />
            <p className="text-[14px] font-bold tracking-wide mb-1 text-yellow-300">
              Purble Place (Pueblo Completo)
            </p>
            <p className="text-[11px] text-purple-200 mb-1">
              Cargando el pueblo original de Windows...
            </p>
            <p className="text-[10px] text-purple-300 mb-4 animate-pulse">
              Comfy Cakes &bull; Purble Pairs &bull; Purble Shop
            </p>
            <div className="w-[200px] h-[14px] win-sunken bg-white p-[1px] relative overflow-hidden">
              <div className="h-full bg-[#8A2BE2] animate-pulse w-full" />
            </div>
          </div>
        )}

        {/*
          Iframe del juego original con sandbox estricto:
          - sandbox="allow-scripts allow-same-origin allow-forms"
            Previene popups, ventanas emergentes y redirecciones no deseadas.
          - referrerpolicy="no-referrer"
            Evita restricciones de referer local.
        */}
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={PURBLE_PLACE_URL}
          title="Purble Place"
          onLoad={() => setIsLoading(false)}
          className="w-full h-full border-0 block bg-[#1E0F36]"
          allow="autoplay; fullscreen; gamepad; focus-without-user-activation *"
          sandbox="allow-scripts allow-same-origin allow-forms"
          referrerPolicy="no-referrer"
          scrolling="no"
        />
      </div>

      {/* 3. Barra de estado inferior clásica */}
      <div className="bg-[#C0C0C0] text-black text-[11px] h-[22px] px-2 flex items-center justify-between border-t border-[#808080] select-none font-sans">
        <div className="flex items-center space-x-2 truncate">
          <span className="font-bold text-[#4B0082]">🏰 Pueblo Completo:</span>
          <span className="text-[#333] truncate text-[10px]">
            🃏 Escuela (Purble Pairs) &bull; 🎂 Pastelería (Comfy Cakes) &bull; 👔 Tienda (Purble Shop)
          </span>
        </div>
        <div className="text-[10px] text-gray-600 flex-shrink-0 font-mono hidden sm:block ml-2">
          Control: Ratón / Clic
        </div>
      </div>

      {/* Diálogo Cómo Jugar Purble Place */}
      {showHelpDialog && (
        <div
          role="dialog"
          aria-label="Cómo jugar Purble Place"
          className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center p-4 select-none"
        >
          <div className="win-raised bg-[#C0C0C0] p-[3px] w-full max-w-[470px] text-black">
            <div className="win-titlebar-active flex items-center justify-between px-1.5 py-0.5 mb-2">
              <span className="text-[11px] font-bold">Instrucciones de Purble Place</span>
              <button
                type="button"
                onClick={() => setShowHelpDialog(false)}
                className="win-button w-4 h-[14px] p-0 font-bold text-[9px] flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-3 text-[11px] leading-relaxed win-sunken bg-white max-h-[350px] overflow-y-auto space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-300">
                <Image
                  src="/icons/purble-place.png"
                  alt=""
                  width={36}
                  height={36}
                  className="pixelated"
                />
                <div>
                  <h4 className="font-bold text-[12px] text-[#4B0082]">Purble Place Original</h4>
                  <p className="text-[10px] text-gray-500">Los 3 minijuegos oficiales de Windows</p>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-[#8A2BE2] flex items-center space-x-1">
                  <span>🏰</span>
                  <span>El Pueblo de Purble Place</span>
                </h5>
                <p className="text-[11px] text-gray-700 mt-0.5">
                  Estás en el mapa interactivo del pueblo original. Haz clic en cualquiera de los tres edificios
                  para entrar directamente al minijuego que desees:
                </p>
              </div>

              <div>
                <h5 className="font-bold text-[#8A2BE2] flex items-center space-x-1">
                  <span>🃏</span>
                  <span>1. Purble Pairs (La Escuela - Edificio Izquierdo)</span>
                </h5>
                <p className="text-[11px] text-gray-700 mt-0.5">
                  Haz clic en la Escuela con la bandera de trébol verde. Voltea las baldosas de trébol para
                  encontrar parejas idénticas, relojes y comodines antes de que se acabe el tiempo.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-[#8A2BE2] flex items-center space-x-1">
                  <span>🎂</span>
                  <span>2. Comfy Cakes (La Pastelería - Edificio Central)</span>
                </h5>
                <p className="text-[11px] text-gray-700 mt-0.5">
                  Haz clic en la Pastelería con el gorro de chef. Mira la televisión en la esquina superior izquierda
                  para ver el pedido y prepara el pastel en la cinta transportadora:
                  <strong> Molde ➔ Masa ➔ Relleno ➔ Glaseado ➔ Topping</strong>.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-[#8A2BE2] flex items-center space-x-1">
                  <span>👔</span>
                  <span>3. Purble Shop (La Tienda de Ropa - Edificio Derecho)</span>
                </h5>
                <p className="text-[11px] text-gray-700 mt-0.5">
                  Haz clic en la Tienda con el espejo. Deducción lógica estilo Mastermind: elige ojos, nariz, boca,
                  gorro y ropa para descubrir el personaje misterioso siguiendo las pistas de colores del espejo.
                </p>
              </div>
            </div>
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => {
                  setShowHelpDialog(false);
                  handleFocusGame();
                }}
                className="win-button win-button-default min-w-[70px] py-0.5 text-[11px] font-bold cursor-pointer"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diálogo Acerca de Purble Place */}
      {showAboutDialog && (
        <div
          role="dialog"
          aria-label="Acerca de Purble Place"
          className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center p-4 select-none"
        >
          <div className="win-raised bg-[#C0C0C0] p-[3px] w-full max-w-[380px] text-black">
            <div className="win-titlebar-active flex items-center justify-between px-1.5 py-0.5 mb-2">
              <span className="text-[11px] font-bold">Acerca de Purble Place</span>
              <button
                type="button"
                onClick={() => setShowAboutDialog(false)}
                className="win-button w-4 h-[14px] p-0 font-bold text-[9px] flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-4 text-[11px] leading-relaxed win-sunken bg-white flex items-start space-x-3">
              <Image
                src="/icons/purble-place.png"
                alt=""
                width={40}
                height={40}
                className="pixelated flex-shrink-0"
              />
              <div className="space-y-1.5">
                <h4 className="font-bold text-[12px] text-[#4B0082]">
                  Purble Place
                </h4>
                <p className="text-[10px] text-gray-600">
                  Desarrollado originalmente por Oberon Media para Microsoft Windows Vista y Windows 7.
                </p>
                <p className="text-[10px] text-gray-500">
                  Versión original completa del pueblo con los 3 minijuegos interactivos.
                </p>
                <div className="pt-2 text-[10px] font-bold text-gray-700">
                  Integrado en ECOS 98 con protección contra anuncios emergentes.
                </div>
              </div>
            </div>
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => {
                  setShowAboutDialog(false);
                  handleFocusGame();
                }}
                className="win-button win-button-default min-w-[70px] py-0.5 text-[11px] font-bold cursor-pointer"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
