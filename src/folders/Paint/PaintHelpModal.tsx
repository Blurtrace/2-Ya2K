'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { ABOUT_DEDICATION } from './paintData';

type PaintHelpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Cuadro de diálogo de información "About Yaczury Navarro..."
 * Estilo Windows 98 Help / About dialog con dedicatoria en panel tipo Bloc de Notas.
 */
export const PaintHelpModal = ({ isOpen, onClose }: PaintHelpModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-yaczury-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-3 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-[460px] win-raised bg-[#C0C0C0] p-[3px] shadow-2xl border border-[#808080] flex flex-col max-h-[90vh] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra de título clásica Windows 98 */}
        <div className="bg-gradient-to-r from-[#000080] to-[#1084D0] text-white px-2 py-1 flex items-center justify-between text-[11px] font-bold select-none flex-shrink-0">
          <div className="flex items-center space-x-1.5 truncate">
            <Image
              src="/icons/paint.png"
              alt=""
              width={16}
              height={16}
              className="w-4 h-4 pixelated flex-shrink-0"
            />
            <span id="about-yaczury-title" className="truncate">
              {ABOUT_DEDICATION.windowTitle}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="win-button w-4 h-[14px] p-0 font-bold text-[9px] flex items-center justify-center leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo del diálogo */}
        <div className="p-3 sm:p-4 flex flex-col gap-3 min-h-0 overflow-hidden">
          {/* Cabecera con icono decorativo y título */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 win-sunken bg-white flex items-center justify-center text-xl flex-shrink-0 shadow-inner">
              👑
            </div>
            <div>
              <h2 className="text-[13px] font-bold text-black font-sans leading-tight">
                {ABOUT_DEDICATION.heading}
              </h2>
              <span className="text-[10px] text-neutral-600 font-sans">
                ECOS 98 • Edición Especial de Cumpleaños
              </span>
            </div>
          </div>

          {/* Panel de texto estilo Notepad blanco */}
          <div className="win-sunken bg-white p-3 sm:p-4 text-black text-[12px] font-sans leading-relaxed overflow-y-auto max-h-[320px] select-text shadow-inner border border-[#808080]">
            <p className="font-bold text-[#000080] mb-2 text-[12.5px]">
              {ABOUT_DEDICATION.heading}
            </p>

            <div className="space-y-2.5 text-neutral-900">
              {ABOUT_DEDICATION.paragraphs.map((p, idx) => (
                <p key={idx} className="whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>

            {/* Separador sutil */}
            <div className="my-3 border-t border-neutral-300" />

            {/* Firma separada */}
            <div className="text-right pt-1">
              <span className="font-bold text-[#000080] italic text-[11.5px] block">
                {ABOUT_DEDICATION.signature}
              </span>
            </div>
          </div>

          {/* Pie con botón Aceptar */}
          <div className="flex justify-end pt-1 flex-shrink-0">
            <button
              type="button"
              autoFocus
              onClick={onClose}
              className="win-button px-6 py-1 bg-[#C0C0C0] text-black font-bold text-[11px] cursor-pointer active:win-pressed shadow"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
