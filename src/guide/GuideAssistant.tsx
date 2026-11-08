'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOs } from '@/os/state/OsContext';
import { useT } from '@/i18n/I18nContext';
import { GuideCharacter } from './GuideCharacter';
import { GUIDE_STEPS } from './guideData';

/**
 * Asistente de ECOS 98 con estética Windows 98 / Office Assistant (Clippy retro).
 * Guiado por TATA (Taehyung / V) y COOKY (Jungkook) en sus versiones BT21.
 * Permite avanzar paso a paso, saltar de tema, abrir directamente las carpetas explicadas
 * o minimizarse en un avatar flotante interactivo.
 */
export const GuideAssistant = () => {
  const { state, dispatch } = useOs();
  const { t } = useT();

  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0,
  });

  const cardRef = useRef<HTMLDivElement>(null);

  // Inicializar posición predeterminada en la esquina inferior derecha
  useEffect(() => {
    if (typeof window !== 'undefined' && position === null) {
      const isMobile = window.innerWidth < 640;
      const initialX = isMobile ? Math.max(8, (window.innerWidth - 340) / 2) : window.innerWidth - 420;
      const initialY = Math.max(40, window.innerHeight - 310);
      setPosition({ x: initialX, y: initialY });
    }
  }, [position]);

  // Manejo de arrastre de la ventana retro
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: position?.x ?? 0,
      startY: position?.y ?? 0,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !position) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    const nextX = Math.max(0, Math.min(window.innerWidth - 340, dragStartRef.current.startX + dx));
    const nextY = Math.max(0, Math.min(window.innerHeight - 180, dragStartRef.current.startY + dy));
    setPosition({ x: nextX, y: nextY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  if (!state.guideOpen) return null;

  // Mini-avatar flotante cuando está minimizado
  if (state.guideMinimized) {
    return (
      <div
        onClick={() => dispatch({ type: 'RESTORE_GUIDE' })}
        title={t('guide.trayTooltip')}
        className="fixed bottom-[34px] right-3 z-[9985] cursor-pointer group select-none animate-bounce"
        style={{ animationDuration: '3s' }}
      >
        <div className="relative flex flex-col items-center">
          {/* Pequeño globo de diálogo */}
          <div className="mb-1 win-raised bg-[#FFFFE5] text-black text-[10px] font-bold px-2 py-0.5 border border-[#808080] shadow-md group-hover:bg-[#FFF] transition-colors">
            <span>{t('guide.miniBubble')}</span>
          </div>
          {/* Avatar de TATA en miniatura */}
          <div className="p-1 win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] shadow-lg">
            <GuideCharacter character="tata" pose={1} size="sm" />
          </div>
        </div>
      </div>
    );
  }

  const currentStepIndex = Math.min(Math.max(0, state.guideStep), GUIDE_STEPS.length - 1);
  const currentStep = GUIDE_STEPS[currentStepIndex];

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      dispatch({ type: 'SET_GUIDE_STEP', step: currentStepIndex - 1 });
    }
  };

  const handleNext = () => {
    if (currentStepIndex < GUIDE_STEPS.length - 1) {
      dispatch({ type: 'SET_GUIDE_STEP', step: currentStepIndex + 1 });
    } else {
      dispatch({ type: 'CLOSE_GUIDE' });
    }
  };

  const handleOpenTarget = (folderId: string) => {
    dispatch({ type: 'OPEN', id: folderId });
  };

  return (
    <aside
      aria-label={t('guide.windowTitle')}
      ref={cardRef}
      style={
        position
          ? {
              left: `${position.x}px`,
              top: `${position.y}px`,
            }
          : undefined
      }
      className={`fixed z-[9988] w-[340px] sm:w-[410px] win-raised bg-[#C0C0C0] p-[3px] shadow-2xl border border-[#A0A0A0] text-black select-none ${
        !position ? 'bottom-[36px] right-3' : ''
      }`}
    >
      {/* Barra de título clásica de Windows 98 */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="bg-gradient-to-r from-[#000080] to-[#1084D0] text-white px-2 py-0.5 flex items-center justify-between text-[11px] font-bold cursor-move select-none"
      >
        <div className="flex items-center space-x-1.5 truncate">
          <span>💜</span>
          <span className="truncate">{t('guide.windowTitle')}</span>
        </div>
        <div className="flex items-center space-x-1">
          {/* Botón Minimizar */}
          <button
            type="button"
            onClick={() => dispatch({ type: 'MINIMIZE_GUIDE' })}
            className="win-raised w-4 h-4 flex items-center justify-center bg-[#C0C0C0] text-black text-[9px] font-bold cursor-pointer"
            title={t('guide.minimize')}
          >
            _
          </button>
          {/* Botón Cerrar */}
          <button
            type="button"
            onClick={() => dispatch({ type: 'CLOSE_GUIDE' })}
            className="win-raised w-4 h-4 flex items-center justify-center bg-[#C0C0C0] text-black text-[10px] font-bold cursor-pointer"
            title={t('guide.close')}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Cuerpo principal del asistente */}
      <div className="p-2 flex gap-3 items-start">
        {/* Columna izquierda: Personaje animado y Badge */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="p-1 win-raised bg-[#C0C0C0] mb-1.5 flex items-center justify-center">
            <GuideCharacter character={currentStep.character} pose={currentStep.pose} size="md" />
          </div>
          <span className="win-sunken bg-[#E4E4E4] text-[#000080] font-bold text-[9.5px] px-2 py-0.5 text-center whitespace-nowrap">
            {t(currentStep.badgeKey)}
          </span>
        </div>

        {/* Columna derecha: Globo de diálogo retro (estilo nota amarilla clásica de ayuda) */}
        <div className="flex-1 min-w-0">
          <div className="win-sunken bg-[#FFFFE5] p-2.5 text-black min-h-[110px] flex flex-col justify-between shadow-inner">
            <div>
              <h2 className="text-[#000080] font-bold text-[12px] mb-1 flex items-center justify-between">
                <span>{t(currentStep.titleKey)}</span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {currentStepIndex + 1}/{GUIDE_STEPS.length}
                </span>
              </h2>
              <p className="text-[11px] leading-relaxed text-[#111111] font-sans">
                {t(currentStep.textKey)}
              </p>
            </div>

            {/* Botón interactivo para abrir la carpeta directamente */}
            {currentStep.targetFolderId && currentStep.actionButtonKey && (
              <div className="mt-2 pt-1 border-t border-[#D0D0B0]">
                <button
                  type="button"
                  onClick={() => handleOpenTarget(currentStep.targetFolderId!)}
                  className="win-raised active:win-pressed px-2 py-0.5 bg-[#C0C0C0] text-black font-bold text-[10px] flex items-center space-x-1 cursor-pointer hover:bg-[#D4D0C8]"
                >
                  <span>{t(currentStep.actionButtonKey)}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pie de navegación retro */}
      <div className="flex items-center justify-between px-2 py-1 border-t border-[#808080] bg-[#C0C0C0] text-[11px]">
        <span className="text-[10px] text-neutral-600 font-mono">
          {t('guide.stepOf', { current: currentStepIndex + 1, total: GUIDE_STEPS.length })}
        </span>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`win-raised active:win-pressed px-2.5 py-0.5 text-[11px] ${
              currentStepIndex === 0 ? 'opacity-40 cursor-default' : 'cursor-pointer hover:bg-[#D4D0C8]'
            }`}
          >
            {t('guide.prev')}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="win-raised active:win-pressed px-3 py-0.5 bg-[#C0C0C0] text-black font-bold text-[11px] cursor-pointer hover:bg-[#D4D0C8]"
          >
            {currentStepIndex === GUIDE_STEPS.length - 1 ? t('guide.finish') : t('guide.next')}
          </button>
        </div>
      </div>
    </aside>
  );
};
