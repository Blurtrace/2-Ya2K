'use client';

import React, { useEffect, useRef } from 'react';
import type { ContextMenuState } from './state/types';
import { useOs } from './state/OsContext';
import { useT } from '@/i18n/I18nContext';

type ContextMenuProps = {
  menu: ContextMenuState;
};

/**
 * Menú contextual al hacer clic derecho sobre el escritorio.
 */
export const ContextMenu = ({ menu }: ContextMenuProps) => {
  const { dispatch } = useOs();
  const { t } = useT();
  const menuRef = useRef<HTMLDivElement>(null);

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

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'CLOSE_CONTEXT_MENU' });
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

  return (
    <div
      ref={menuRef}
      style={{ top: `${menu.y}px`, left: `${menu.x}px` }}
      className="fixed z-[9990] win-raised bg-[#C0C0C0] p-[2px] w-[140px] text-[11px] select-none text-black"
    >
      <div
        onClick={handleRefresh}
        className="px-3 py-1 cursor-pointer hover:bg-[#000080] hover:text-white"
      >
        {t('context.arrangeIcons')}
      </div>
      <div
        onClick={handleRefresh}
        className="px-3 py-1 cursor-pointer hover:bg-[#000080] hover:text-white"
      >
        {t('context.refresh')}
      </div>
      <div className="my-1 win-etched h-[2px]" />
      <div
        onClick={handleProperties}
        className="px-3 py-1 cursor-pointer hover:bg-[#000080] hover:text-white"
      >
        {t('context.properties')}
      </div>
    </div>
  );
};

