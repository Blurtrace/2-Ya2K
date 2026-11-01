'use client';

import React from 'react';
import Image from 'next/image';
import { useOs } from './state/OsContext';
import { findFolderById } from '@/folders/registry';
import { useClock } from './hooks/useClock';
import { useT } from '@/i18n/I18nContext';

/**
 * Barra de tareas fija en la parte inferior del escritorio.
 * Altura de 28px, bisel elevado, botón Inicio, ventanas abiertas y bandeja del sistema.
 */
export const Taskbar = () => {
  const { state, dispatch } = useOs();
  const { lang, setLang, t } = useT();
  const clockText = useClock(lang);

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_START' });
  };

  const handleTaskClick = (id: string) => {
    const windowState = state.windows.find((w) => w.id === id);
    if (!windowState) return;

    if (state.activeId === id && !windowState.minimized) {
      // Si ya está enfocada y visible, minimizar
      dispatch({ type: 'MINIMIZE', id });
    } else {
      // Si está minimizada o no enfocada, enfocar y restaurar
      dispatch({ type: 'FOCUS', id });
    }
  };

  const toggleLanguage = () => {
    setLang(lang === 'es' ? 'en' : 'es');
  };

  return (
    <footer
      role="region"
      aria-label="Taskbar"
      className="fixed bottom-0 left-0 right-0 h-[28px] win-raised bg-[#C0C0C0] z-[9990] flex items-center justify-between px-1 select-none"
    >
      {/* Sección Izquierda: Botón Inicio y Botones de Ventanas */}
      <div className="flex items-center space-x-1.5 flex-1 min-w-0 mr-1 overflow-hidden h-full py-[2px]">
        {/* Botón Inicio */}
        <button
          id="taskbar-start-button"
          type="button"
          onClick={handleStartClick}
          className={`h-[22px] px-1.5 flex items-center space-x-1 font-bold text-[11px] cursor-pointer select-none ${
            state.startMenuOpen ? 'win-pressed font-extrabold' : 'win-button'
          }`}
          aria-expanded={state.startMenuOpen}
        >
          <Image
            src="/icons/ecos-logo.png"
            alt=""
            width={16}
            height={16}
            className="pixelated w-4 h-4 flex-shrink-0"
          />
          <span className="leading-none text-black">{t('taskbar.start')}</span>
        </button>

        {/* Separador vertical grabado */}
        <div className="h-[18px] w-[2px] border-l border-[#808080] border-r border-[#FFFFFF] mx-0.5 flex-shrink-0" />

        {/* Lista de ventanas abiertas */}
        <div className="flex items-center space-x-1 flex-1 overflow-x-auto h-full scrollbar-none">
          {state.windows.map((win) => {
            const folderDef = findFolderById(win.id);
            if (!folderDef) return null;

            const isWindowActive = state.activeId === win.id && !win.minimized;
            const windowTitle = t(folderDef.nameKey);

            return (
              <button
                key={win.id}
                type="button"
                onClick={() => handleTaskClick(win.id)}
                className={`h-[22px] max-w-[150px] min-w-[70px] flex-1 px-1.5 flex items-center space-x-1 text-left cursor-pointer truncate ${
                  isWindowActive
                    ? 'win-pressed bg-[#dfdfdf] font-bold'
                    : 'win-button'
                }`}
                title={windowTitle}
              >
                <Image
                  src={folderDef.icon}
                  alt=""
                  width={14}
                  height={14}
                  className="pixelated w-3.5 h-3.5 flex-shrink-0"
                />
                <span className="text-[11px] truncate leading-none text-black">
                  {windowTitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sección Derecha: Bandeja del sistema (Tray) */}
      <div className="win-sunken bg-[#C0C0C0] h-[22px] px-2 flex items-center space-x-2 text-[11px] flex-shrink-0">
        {/* Selector de idioma ES / EN */}
        <button
          type="button"
          onClick={toggleLanguage}
          title={`Idioma activo: ${lang.toUpperCase()} (Clic para alternar)`}
          className="font-bold text-[10px] text-black hover:text-[#000080] cursor-pointer uppercase px-0.5 border border-transparent hover:border-[#808080]"
        >
          {lang}
        </button>

        {/* Icono de volumen decorativo */}
        <div className="flex items-center justify-center">
          <Image
            src="/icons/volume.png"
            alt="Volumen"
            width={14}
            height={14}
            className="pixelated w-3.5 h-3.5"
          />
        </div>

        {/* Reloj del sistema HH:MM */}
        <span className="text-black font-normal tabular-nums min-w-[34px] text-center">
          {clockText || '--:--'}
        </span>
      </div>
    </footer>
  );
};

