'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import type { FolderDef } from './state/types';
import { useT } from '@/i18n/I18nContext';

type DesktopIconProps = {
  folder: FolderDef;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
};

/**
 * Icono de escritorio Windows 98.
 * Rejilla de ~75px, icono 32x32, etiqueta con sombra de texto o resaltada en azul marino.
 * Doble clic (o doble toque) abre la ventana; un solo clic selecciona.
 */
export const DesktopIcon = ({ folder, isSelected, onSelect, onOpen }: DesktopIconProps) => {
  const { t } = useT();
  const lastTapRef = useRef<number>(0);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(folder.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen(folder.id);
  };

  // Manejador para pantallas táctiles (doble toque)
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      onOpen(folder.id);
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      onSelect(folder.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onOpen(folder.id);
    }
  };

  const folderName = t(folder.nameKey);

  return (
    <button
      type="button"
      tabIndex={0}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      className="group flex flex-col items-center justify-start w-[76px] p-1 select-none cursor-pointer focus:outline-none"
      aria-label={folderName}
    >
      {/* Icono de 32x32 píxeles con renderizado pixelado */}
      <div className="relative w-8 h-8 flex items-center justify-center">
        <Image
          src={folder.icon}
          alt=""
          aria-hidden="true"
          width={32}
          height={32}
          className="pointer-events-none select-none pixelated"
          priority
        />
        {/* Velo azul translúcido cuando está seleccionado */}
        {isSelected && (
          <div className="absolute inset-0 bg-[#000080] opacity-40 mix-blend-color pointer-events-none" />
        )}
      </div>

      {/* Etiqueta del icono con máximo 2 líneas */}
      <span
        className={`mt-1 px-1 text-[11px] text-center leading-tight line-clamp-2 break-words ${
          isSelected
            ? 'bg-[#000080] text-white outline outline-1 outline-dotted outline-white'
            : 'text-white'
        }`}
        style={
          isSelected
            ? undefined
            : {
                textShadow:
                  '1px 1px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000',
              }
        }
      >
        {folderName}
      </span>
    </button>
  );
};

