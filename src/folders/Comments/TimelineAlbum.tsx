'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { albumData, type MediaItem } from './albumData';
import { PolaroidCard } from './PolaroidCard';

/**
 * Visor de Álbum Fotográfico Cronológico estilo Windows 98 Classic.
 * Incluye carrusel horizontal, línea de tiempo de navegación por años,
 * modo diapositivas, revelado químico progresivo y tarjeta Polaroid volteable.
 */
export const TimelineAlbum = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(() => new Set());

  const currentItem = albumData[currentIndex];

  // Marcar una foto como revelada una vez finaliza la animación
  const handlePhotoRevealed = useCallback((id: string) => {
    setRevealedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // Lista única de años ordenados para la línea de tiempo inferior
  const timelineYears = useMemo(() => {
    const yearsMap = new Map<string, number>(); // Label -> First index
    albumData.forEach((item, index) => {
      const label = item.mediaType === 'card'
        ? 'Cumpleaños 🎂'
        : item.year !== null
        ? String(item.year)
        : 'Sin Fecha';

      if (!yearsMap.has(label)) {
        yearsMap.set(label, index);
      }
    });

    return Array.from(yearsMap.entries()).map(([label, index]) => ({
      label,
      index,
    }));
  }, []);

  // Navegación anterior / siguiente
  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : albumData.length - 1));
  }, []);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev < albumData.length - 1 ? prev + 1 : 0));
  }, []);

  const handleToggleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Modo diapositivas automático
  useEffect(() => {
    if (!isPlayingSlideshow) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(timer);
  }, [isPlayingSlideshow, handleNext]);

  // Controles de teclado retro (Flechas izquierda/derecha, Espacio para voltear)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleToggleFlip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, handleToggleFlip]);

  // Identificar el año activo actual
  const activeYearLabel = currentItem.mediaType === 'card'
    ? 'Cumpleaños 🎂'
    : currentItem.year !== null
    ? String(currentItem.year)
    : 'Sin Fecha';

  return (
    <div className="flex-1 flex flex-col h-full bg-[#C0C0C0] text-black select-none overflow-hidden font-sans">
      {/* ================= BARRA DE HERRAMIENTAS RETRO WINDOWS 98 ================= */}
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-[#808080] bg-[#C0C0C0] text-[11px] flex-wrap gap-1 shadow-sm">
        {/* Botones de navegación y reproducción */}
        <div className="flex items-center space-x-1">
          <button
            onClick={handlePrev}
            className="win-raised active:win-pressed px-2.5 py-1 bg-[#C0C0C0] text-black text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
            title="Foto anterior (Flecha Izquierda)"
          >
            <span>⏮️</span>
            <span>Anterior</span>
          </button>

          <button
            onClick={() => setIsPlayingSlideshow((prev) => !prev)}
            className={`px-2.5 py-1 text-[11px] font-bold flex items-center space-x-1 cursor-pointer ${
              isPlayingSlideshow ? 'win-pressed bg-[#e0e0e0]' : 'win-raised bg-[#C0C0C0]'
            }`}
            title="Reproducción automática de diapositivas"
          >
            <span>{isPlayingSlideshow ? '⏸️' : '▶️'}</span>
            <span>{isPlayingSlideshow ? 'Pausa' : 'Diapositivas'}</span>
          </button>

          <button
            onClick={handleNext}
            className="win-raised active:win-pressed px-2.5 py-1 bg-[#C0C0C0] text-black text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
            title="Foto siguiente (Flecha Derecha)"
          >
            <span>Siguiente</span>
            <span>⏭️</span>
          </button>

          <div className="w-[1px] h-4 bg-[#808080] mx-1" />

          <button
            onClick={handleToggleFlip}
            className="win-raised active:win-pressed px-2.5 py-1 bg-[#C0C0C0] text-black text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
            title="Voltear fotografía para ver dedicatoria (Barra Espaciadora)"
          >
            <span>🔄</span>
            <span>{isFlipped ? 'Ver Foto' : 'Voltear Carta'}</span>
          </button>
        </div>

        {/* Placa retro con contador y fecha actual */}
        <div className="win-sunken bg-white px-2.5 py-0.5 text-[11px] font-mono flex items-center space-x-2">
          <span className="text-[#000080] font-bold">
            [{currentIndex + 1} / {albumData.length}]
          </span>
          <span className="text-black font-sans font-semibold">
            {currentItem.displayDate} {currentItem.location ? `— ${currentItem.location}` : ''}
          </span>
        </div>
      </div>

      {/* ================= VISOR CENTRAL CON MARCO POLAROID CENTRADO ================= */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-5 overflow-auto bg-[#808080]/20 win-sunken relative">
        <PolaroidCard
          key={currentItem.id}
          item={currentItem}
          isFlipped={isFlipped}
          onFlipToggle={handleToggleFlip}
          isAlreadyRevealed={revealedIds.has(currentItem.id)}
          onRevealed={handlePhotoRevealed}
        />
      </div>

      {/* ================= LÍNEA DE TIEMPO CRONOLÓGICA INFERIOR ================= */}
      <div className="border-t border-[#808080] bg-[#C0C0C0] px-2 py-1.5 flex flex-col space-y-1">
        <div className="flex items-center justify-between text-[10px] text-[#444] px-1 font-bold">
          <span>LÍNEA DE TIEMPO CRONOLÓGICA (2009 — 2026)</span>
          <span>{currentItem.sender ? `Remitente: ${currentItem.sender}` : ''}</span>
        </div>

        {/* Carrusel horizontal de años / hitos */}
        <div className="win-sunken bg-white p-1 overflow-x-auto flex space-x-1.5 scrollbar-thin">
          {timelineYears.map(({ label, index }) => {
            const isActive = label === activeYearLabel;
            return (
              <button
                key={label}
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentIndex(index);
                }}
                className={`px-2 py-0.5 text-[10px] whitespace-nowrap cursor-pointer transition-none ${
                  isActive
                    ? 'bg-[#000080] text-white font-bold'
                    : 'bg-[#E0E0E0] hover:bg-[#D0D0D0] text-black win-raised'
                }`}
                title={`Ir a ${label}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
