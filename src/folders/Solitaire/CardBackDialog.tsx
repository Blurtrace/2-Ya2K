'use client';

import React, { useState } from 'react';
import type { CardBackTheme } from './types';
import { CardBackView } from './CardView';

type CardBackDialogProps = {
  currentTheme: CardBackTheme;
  onSelect: (theme: CardBackTheme) => void;
  onClose: () => void;
};

const THEMES: { id: CardBackTheme; label: string }[] = [
  { id: 'geometric', label: 'Azul Clásico' },
  { id: 'beach', label: 'Playa y Palmera' },
  { id: 'castle', label: 'Castillo Encantado' },
  { id: 'robot', label: 'Robot de Cuerda' },
  { id: 'roses', label: 'Rosas Silvestres' },
];

/**
 * Diálogo de selección de reverso de baraja de Windows 98.
 */
export const CardBackDialog = ({
  currentTheme,
  onSelect,
  onClose,
}: CardBackDialogProps) => {
  const [selected, setSelected] = useState<CardBackTheme>(currentTheme);

  const handleConfirm = () => {
    onSelect(selected);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-label="Seleccionar Baraja"
      className="absolute inset-0 z-40 bg-black/30 flex items-center justify-center p-4 select-none"
    >
      <div className="win-raised bg-[#C0C0C0] p-[3px] w-full max-w-[360px] text-black">
        {/* Barra de título */}
        <div className="win-titlebar-active flex items-center justify-between px-1.5 py-0.5 mb-2">
          <span className="text-[11px] font-bold">Seleccionar Baraja</span>
          <button
            type="button"
            onClick={onClose}
            className="win-button w-4 h-[14px] p-0 font-bold text-[9px] flex items-center justify-center"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Rejilla de barajas */}
        <div className="p-2">
          <p className="text-[11px] mb-2 font-semibold">
            Elige el diseño para el reverso de las cartas:
          </p>
          <div className="grid grid-cols-3 gap-2 win-sunken p-3 bg-[#E8E8E8] max-h-[220px] overflow-y-auto">
            {THEMES.map((theme) => {
              const isCurrent = selected === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelected(theme.id)}
                  className={`flex flex-col items-center p-1.5 rounded-[2px] transition-all text-center ${
                    isCurrent
                      ? 'bg-[#000080] text-white outline-1 outline-dotted outline-white'
                      : 'hover:bg-[#DDD] text-black'
                  }`}
                >
                  <div className="w-[50px] h-[70px] mb-1 pointer-events-none">
                    <CardBackView theme={theme.id} />
                  </div>
                  <span className="text-[10px] font-bold leading-tight line-clamp-1">
                    {theme.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-2 p-2 pt-1 border-t border-[#808080]">
          <button
            type="button"
            onClick={handleConfirm}
            className="win-button win-button-default min-w-[70px] py-0.5 text-[11px] font-bold"
          >
            Aceptar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="win-button min-w-[70px] py-0.5 text-[11px]"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
