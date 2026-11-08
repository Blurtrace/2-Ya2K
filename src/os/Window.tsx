'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import type { WindowState, FolderDef } from './state/types';
import { useOs } from './state/OsContext';
import { useDrag } from './hooks/useDrag';
import { useT } from '@/i18n/I18nContext';

type WindowProps = {
  windowState: WindowState;
  folderDef: FolderDef;
  children: React.ReactNode;
};

/**
 * Componente de Ventana clásica de Windows 98.
 * Barra de título con degradado activo/inactivo, botones biselados de control,
 * soporte para arrastrar, maximizar/restaurar, minimizar y enfocar.
 */
export const Window = ({ windowState, folderDef, children }: WindowProps) => {
  const { state, dispatch } = useOs();
  const { t } = useT();
  const [isMobile, setIsMobile] = useState(false);

  const isActive = state.activeId === windowState.id;
  const isMaximized = windowState.maximized || isMobile;

  // Detección de ancho de pantalla <= 768px (móvil)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hook de arrastre con Pointer Events
  const { onPointerDown, onPointerMove, onPointerUp } = useDrag({
    initialX: windowState.x,
    initialY: windowState.y,
    disabled: isMaximized,
    onMove: (newX, newY) => {
      dispatch({ type: 'MOVE', id: windowState.id, x: newX, y: newY });
    },
  });

  const handleWindowClick = () => {
    if (!isActive) {
      dispatch({ type: 'FOCUS', id: windowState.id });
    }
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'MINIMIZE', id: windowState.id });
  };

  const handleToggleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMobile) {
      dispatch({ type: 'TOGGLE_MAXIMIZE', id: windowState.id });
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'CLOSE', id: windowState.id });
  };

  const folderTitle =
    folderDef.id === 'if-love-were-songs'
      ? 'Windows Media Player - If love were songs ♡'
      : t(folderDef.nameKey);

  // Si está minimizada, no se dibuja en pantalla (pero vive en la barra de tareas)
  if (windowState.minimized) {
    return null;
  }

  // Estilos de posición (absoluta fija si maximizada, o en coordenadas x/y)
  const windowStyle: React.CSSProperties = isMaximized
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 28px)', // Altura descontando la barra de tareas
        zIndex: windowState.zIndex,
      }
    : {
        position: 'absolute',
        top: `${windowState.y}px`,
        left: `${windowState.x}px`,
        width: `${windowState.width}px`,
        height: `${windowState.height}px`,
        zIndex: windowState.zIndex,
      };

  return (
    <section
      role="dialog"
      aria-label={folderTitle}
      onClick={handleWindowClick}
      style={windowStyle}
      className="win-raised bg-[#C0C0C0] p-[3px] flex flex-col select-none overflow-hidden"
    >
      {/* Barra de título con degradado y arrastre */}
      <header
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={handleToggleMaximize}
        className={`flex items-center justify-between px-1 py-[2px] cursor-default ${
          isActive ? 'win-titlebar-active' : 'win-titlebar-inactive'
        }`}
      >
        {/* Icono y título */}
        <div className="flex items-center space-x-1.5 overflow-hidden pr-2">
          <Image
            src={folderDef.icon}
            alt=""
            width={16}
            height={16}
            className="w-4 h-4 pixelated flex-shrink-0"
          />
          <h2 className="text-[11px] font-bold tracking-tight truncate leading-none">
            {folderTitle}
          </h2>
        </div>

        {/* Botones de control de ventana (Minimizar / Maximizar / Cerrar) */}
        <div
          className="flex items-center space-x-[2px] flex-shrink-0"
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          {/* Botón Minimizar */}
          <button
            type="button"
            onClick={handleMinimize}
            aria-label={t('window.minimize')}
            className="win-button w-4 h-[14px] p-0 font-bold text-[9px] flex items-center justify-center leading-none cursor-pointer"
          >
            _
          </button>

          {/* Botón Maximizar / Restaurar */}
          <button
            type="button"
            onClick={handleToggleMaximize}
            disabled={isMobile}
            aria-label={isMaximized ? t('window.restore') : t('window.maximize')}
            className="win-button w-4 h-[14px] p-0 font-bold text-[9px] flex items-center justify-center leading-none disabled:opacity-50 cursor-pointer"
          >
            {isMaximized ? '❐' : '□'}
          </button>

          {/* Botón Cerrar */}
          <button
            type="button"
            onClick={handleClose}
            aria-label={t('dialog.close')}
            className="win-button w-4 h-[14px] p-0 font-bold text-[9px] flex items-center justify-center leading-none ml-0.5 cursor-pointer"
          >
            ✕
          </button>
        </div>
      </header>

      {/* Área de contenido de la ventana */}
      <div className="flex-1 min-h-0 flex flex-col mt-[2px] overflow-hidden">
        {children}
      </div>
    </section>
  );
};

