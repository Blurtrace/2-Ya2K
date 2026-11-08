'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { folders } from '@/folders/registry';
import { useOs } from './state/OsContext';
import { useT } from '@/i18n/I18nContext';

type StartMenuProps = {
  isOpen: boolean;
};

/**
 * Menú Inicio clásico de Windows 98.
 * Barra vertical azul marino a la izquierda con "ECOS", lista de programas/carpetas,
 * submenú de configuración de idioma, acerca de y opción de apagar el sistema.
 */
export const StartMenu = ({ isOpen }: StartMenuProps) => {
  const { dispatch } = useOs();
  const { lang, setLang, t } = useT();
  const menuRef = useRef<HTMLDivElement>(null);
  const [showSettingsSubmenu, setShowSettingsSubmenu] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowSettingsSubmenu(false);
      return;
    }

    const handleClickOutside = (e: MouseEvent) => {
      // Si el clic no fue dentro del menú ni en el botón Inicio
      const target = e.target as HTMLElement;
      if (menuRef.current && !menuRef.current.contains(target) && !target.closest('#taskbar-start-button')) {
        dispatch({ type: 'CLOSE_START' });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch({ type: 'CLOSE_START' });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const handleOpenFolder = (folderId: string) => {
    dispatch({ type: 'OPEN', id: folderId });
    dispatch({ type: 'CLOSE_START' });
  };

  const handleAbout = () => {
    dispatch({
      type: 'SHOW_MODAL',
      modal: {
        titleKey: 'dialog.aboutTitle',
        messageKey: 'dialog.aboutText',
        type: 'info',
      },
    });
    dispatch({ type: 'CLOSE_START' });
  };

  const handleShutdown = () => {
    dispatch({
      type: 'SHOW_MODAL',
      modal: {
        titleKey: 'dialog.shutdownTitle',
        messageKey: 'dialog.shutdownJoke',
        icon: '/icons/shutdown.png',
        type: 'warning',
      },
    });
    dispatch({ type: 'CLOSE_START' });
  };

  return (
    <div
      ref={menuRef}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="fixed bottom-[28px] left-0 z-[9995] win-raised bg-[#C0C0C0] p-[2px] flex select-none text-black"
    >
      {/* Barra lateral vertical azul marino con texto "ECOS 98" (sin desbordamiento) */}
      <div className="w-7 bg-gradient-to-t from-[#000080] to-[#1084D0] flex flex-col justify-end items-center pb-3 select-none flex-shrink-0">
        <span
          className="text-white font-bold text-[13px] tracking-widest uppercase [writing-mode:vertical-rl] rotate-180 whitespace-nowrap mb-2 select-none"
          style={{ textShadow: '1px 1px 0px #000' }}
        >
          ECOS 98
        </span>
      </div>

      {/* Lista de opciones del menú */}
      <div className="w-[190px] py-1 flex flex-col text-[11px] relative">
        {/* Carpetas registradas en registry.ts */}
        {folders.map((folder) => (
          <button
            key={folder.id}
            type="button"
            onClick={() => handleOpenFolder(folder.id)}
            className="w-full flex items-center space-x-2 px-3 py-1.5 text-left hover:bg-[#000080] hover:text-white cursor-pointer focus:outline-none"
          >
            <Image
              src={folder.icon}
              alt=""
              width={20}
              height={20}
              className="pixelated w-5 h-5 flex-shrink-0"
            />
            <span className="truncate">{t(folder.nameKey)}</span>
          </button>
        ))}

        <div className="my-1 win-etched h-[2px]" />

        {/* Configuración / Selector de Idioma con submenú */}
        <div
          onMouseEnter={() => setShowSettingsSubmenu(true)}
          onMouseLeave={() => setShowSettingsSubmenu(false)}
          className="relative"
        >
          <div className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer">
            <div className="flex items-center space-x-2 truncate">
              <span className="text-[12px]">⚙</span>
              <span>{t('startMenu.settings')}</span>
            </div>
            <span className="text-[9px]">▶</span>
          </div>

          {/* Submenú de configuración */}
          {showSettingsSubmenu && (
            <div className="absolute left-full bottom-0 win-raised bg-[#C0C0C0] p-1 w-[150px] shadow-none z-[9996]">
              <div className="px-2 py-1 text-[#555] font-bold text-[10px] uppercase border-b border-[#808080] mb-1">
                {t('startMenu.language')}
              </div>
              <button
                type="button"
                onClick={() => {
                  setLang('es');
                  dispatch({ type: 'CLOSE_START' });
                }}
                className={`w-full flex items-center justify-between px-2 py-1 text-left hover:bg-[#000080] hover:text-white ${
                  lang === 'es' ? 'font-bold' : ''
                }`}
              >
                <span>{t('startMenu.spanish')}</span>
                {lang === 'es' && <span>✓</span>}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLang('en');
                  dispatch({ type: 'CLOSE_START' });
                }}
                className={`w-full flex items-center justify-between px-2 py-1 text-left hover:bg-[#000080] hover:text-white ${
                  lang === 'en' ? 'font-bold' : ''
                }`}
              >
                <span>{t('startMenu.english')}</span>
                {lang === 'en' && <span>✓</span>}
              </button>
            </div>
          )}
        </div>

        {/* Guía interactiva BT21 */}
        <button
          type="button"
          onClick={() => {
            dispatch({ type: 'OPEN_GUIDE' });
            dispatch({ type: 'CLOSE_START' });
          }}
          className="w-full flex items-center space-x-2 px-3 py-1.5 text-left hover:bg-[#000080] hover:text-white cursor-pointer focus:outline-none"
        >
          <span className="text-[13px] leading-none">💜</span>
          <span className="truncate">{t('guide.startMenuTitle')}</span>
        </button>

        {/* Acerca de ECOS */}
        <button
          type="button"
          onClick={handleAbout}
          className="w-full flex items-center space-x-2 px-3 py-1.5 text-left hover:bg-[#000080] hover:text-white cursor-pointer focus:outline-none"
        >
          <span className="text-[12px] text-blue-800">ℹ</span>
          <span>{t('startMenu.about')}</span>
        </button>

        <div className="my-1 win-etched h-[2px]" />

        {/* Apagar el sistema */}
        <button
          type="button"
          onClick={handleShutdown}
          className="w-full flex items-center space-x-2 px-3 py-1.5 text-left hover:bg-[#000080] hover:text-white cursor-pointer focus:outline-none"
        >
          <Image
            src="/icons/shutdown.png"
            alt=""
            width={18}
            height={18}
            className="pixelated w-[18px] h-[18px]"
          />
          <span>{t('startMenu.shutdown')}</span>
        </button>
      </div>
    </div>
  );
};

