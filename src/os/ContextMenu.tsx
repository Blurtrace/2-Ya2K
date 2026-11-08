'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { ContextMenuState, IconSortOrder } from './state/types';
import { useOs } from './state/OsContext';
import { useT } from '@/i18n/I18nContext';

type ContextMenuProps = {
  menu: ContextMenuState;
};

/**
 * Menú contextual al hacer clic derecho sobre el escritorio.
 * Incluye submenú interactivo para Organizar Iconos y función real de Actualizar con parpadeo y reloj de arena.
 */
export const ContextMenu = ({ menu }: ContextMenuProps) => {
  const { state, dispatch } = useOs();
  const { t } = useT();
  const menuRef = useRef<HTMLDivElement>(null);
  const [showSubmenu, setShowSubmenu] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        dispatch({ type: 'CLOSE_CONTEXT_MENU' });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch({ type: 'CLOSE_CONTEXT_MENU' });
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);

  // Actualizar: refresco retro con reloj de arena y parpadeo de escritorio
  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'START_REFRESH' });
  };

  // Organizar iconos por orden seleccionado
  const handleSortSelect = (e: React.MouseEvent, order: IconSortOrder) => {
    e.stopPropagation();
    dispatch({ type: 'SET_ICON_SORT', order });
  };

  const handleProperties = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({
      type: 'SHOW_MODAL',
      modal: {
        titleKey: 'dialog.aboutTitle',
        messageKey: 'dialog.aboutText',
        type: 'info',
      },
    });
    dispatch({ type: 'CLOSE_CONTEXT_MENU' });
  };

  const isNearRightEdge =
    typeof window !== 'undefined' && menu.x + 150 + 130 > window.innerWidth;

  return (
    <div
      ref={menuRef}
      style={{ top: `${menu.y}px`, left: `${menu.x}px` }}
      className="fixed z-[9990] win-raised bg-[#C0C0C0] p-[2px] w-[150px] text-[11px] select-none text-black"
    >
      {/* Opción: Organizar iconos con submenú lateral estilo Windows 98 */}
      <div
        onMouseEnter={() => setShowSubmenu(true)}
        onMouseLeave={() => setShowSubmenu(false)}
        className="relative group"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowSubmenu((prev) => !prev);
          }}
          className={`px-3 py-1 cursor-pointer flex items-center justify-between ${
            showSubmenu ? 'bg-[#000080] text-white' : 'hover:bg-[#000080] hover:text-white'
          }`}
        >
          <span>{t('context.arrangeIcons')}</span>
          <span className="text-[9px] font-mono ml-1">►</span>
        </div>

        {/* Submenú lateral con opciones de ordenamiento */}
        {showSubmenu && (
          <div
            style={{
              left: isNearRightEdge ? '-130px' : '146px',
              top: '-2px',
            }}
            className="absolute z-[9995] win-raised bg-[#C0C0C0] p-[2px] w-[130px] shadow-md flex flex-col"
          >
            {/* Por nombre */}
            <div
              onClick={(e) => handleSortSelect(e, 'name')}
              className="px-2 py-1 cursor-pointer hover:bg-[#000080] hover:text-white flex items-center gap-1.5"
            >
              <span className="w-3 text-center font-bold text-[10px]">
                {state.iconSortOrder === 'name' ? '✓' : ''}
              </span>
              <span>{t('context.byName')}</span>
            </div>

            {/* Por tipo */}
            <div
              onClick={(e) => handleSortSelect(e, 'type')}
              className="px-2 py-1 cursor-pointer hover:bg-[#000080] hover:text-white flex items-center gap-1.5"
            >
              <span className="w-3 text-center font-bold text-[10px]">
                {state.iconSortOrder === 'type' ? '✓' : ''}
              </span>
              <span>{t('context.byType')}</span>
            </div>

            {/* Predeterminado */}
            <div
              onClick={(e) => handleSortSelect(e, 'default')}
              className="px-2 py-1 cursor-pointer hover:bg-[#000080] hover:text-white flex items-center gap-1.5 border-t border-[#808080] mt-0.5 pt-1"
            >
              <span className="w-3 text-center font-bold text-[10px]">
                {state.iconSortOrder === 'default' ? '✓' : ''}
              </span>
              <span>{t('context.byDefault')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Opción: Actualizar */}
      <div
        onClick={handleRefresh}
        className="px-3 py-1 cursor-pointer hover:bg-[#000080] hover:text-white"
      >
        {t('context.refresh')}
      </div>

      <div className="my-1 win-etched h-[2px]" />

      {/* Opción: Propiedades */}
      <div
        onClick={handleProperties}
        className="px-3 py-1 cursor-pointer hover:bg-[#000080] hover:text-white"
      >
        {t('context.properties')}
      </div>
    </div>
  );
};
