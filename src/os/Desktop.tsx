'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useOs } from './state/OsContext';
import { getDesktopFolders, findFolderById } from '@/folders/registry';
import { DesktopIcon } from './DesktopIcon';
import { Window } from './Window';
import { FolderExplorer } from './FolderExplorer';
import { FolderStub } from './FolderStub';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { ContextMenu } from './ContextMenu';
import { MessageBox } from './MessageBox';
import { useT } from '@/i18n/I18nContext';

/** Fallback retro para carga diferida de ventanas */
const WindowLoadingFallback = ({ messageKey }: { messageKey: string }) => {
  const { t } = useT();
  return (
    <div className="w-full h-full min-h-[160px] flex items-center justify-center bg-[#C0C0C0] p-4 text-xs font-mono text-black select-none">
      <div className="flex items-center space-x-2 win-sunken p-3 bg-white border border-[#808080]">
        <span className="inline-block animate-pulse">⏳</span>
        <span>{t(messageKey)}</span>
      </div>
    </div>
  );
};

// Code-splitting dinámico (Fase 1 de Rendimiento)
const GamesExplorer = dynamic(
  () => import('@/folders/Games/GamesExplorer').then((mod) => mod.GamesExplorer),
  {
    ssr: false,
    loading: () => <WindowLoadingFallback messageKey="loading.games" />,
  }
);

const TimelineAlbum = dynamic(
  () => import('@/folders/Comments/TimelineAlbum').then((mod) => mod.TimelineAlbum),
  {
    ssr: false,
    loading: () => <WindowLoadingFallback messageKey="loading.album" />,
  }
);

const OurLoveAlbum = dynamic(
  () => import('@/folders/OurLove/OurLoveAlbum').then((mod) => mod.OurLoveAlbum),
  {
    ssr: false,
    loading: () => <WindowLoadingFallback messageKey="loading.ourLove" />,
  }
);

const MusicPlayerApp = dynamic(
  () => import('@/folders/IfLoveWereSongs/MusicPlayerApp').then((mod) => mod.MusicPlayerApp),
  {
    ssr: false,
    loading: () => <WindowLoadingFallback messageKey="loading.player" />,
  }
);

const MinesweeperApp = dynamic(
  () => import('@/folders/Minesweeper/MinesweeperApp').then((mod) => mod.MinesweeperApp),
  {
    ssr: false,
    loading: () => <WindowLoadingFallback messageKey="loading.minesweeper" />,
  }
);

const SolitaireApp = dynamic(
  () => import('@/folders/Solitaire/SolitaireApp').then((mod) => mod.SolitaireApp),
  {
    ssr: false,
    loading: () => <WindowLoadingFallback messageKey="loading.solitaire" />,
  }
);

const PinballApp = dynamic(
  () => import('@/folders/Pinball/PinballApp').then((mod) => mod.PinballApp),
  {
    ssr: false,
    loading: () => <WindowLoadingFallback messageKey="loading.pinball" />,
  }
);

const PurblePlaceApp = dynamic(
  () => import('@/folders/PurblePlace/PurblePlaceApp').then((mod) => mod.PurblePlaceApp),
  {
    ssr: false,
    loading: () => <WindowLoadingFallback messageKey="loading.purblePlace" />,
  }
);

const VoucherValidatorApp = dynamic(
  () => import('@/folders/VoucherValidator/VoucherValidatorApp').then((mod) => mod.VoucherValidatorApp),
  {
    ssr: false,
    loading: () => <WindowLoadingFallback messageKey="loading.voucherValidator" />,
  }
);

const SpecialVoucherView = dynamic(
  () => import('@/folders/VoucherValidator/SpecialVoucherView').then((mod) => mod.SpecialVoucherView),
  {
    ssr: false,
    loading: () => <WindowLoadingFallback messageKey="loading.specialVoucher" />,
  }
);

/**
 * Componente principal del Escritorio de Windows 98 / ECOS.
 * Administra el fondo teal, los iconos en rejilla vertical, las ventanas abiertas,
 * la barra de tareas, menú inicio y diálogos modales.
 */
export const Desktop = () => {
  const { state, dispatch } = useOs();
  const desktopFolders = getDesktopFolders();

  const handleDesktopClick = () => {
    // Clic en el fondo deselecciona iconos y cierra menús
    dispatch({ type: 'SELECT_ICON', id: null });
    dispatch({ type: 'CLOSE_START' });
    dispatch({ type: 'CLOSE_CONTEXT_MENU' });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    // Si el clic derecho ocurrió dentro de una ventana, diálogo modal o barra de tareas, ignorar
    const target = e.target as HTMLElement | null;
    if (
      target?.closest('[role="dialog"]') ||
      target?.closest('footer') ||
      target?.closest('[role="menu"]')
    ) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    dispatch({
      type: 'OPEN_CONTEXT_MENU',
      x: Math.min(e.clientX, window.innerWidth - 150),
      y: Math.min(e.clientY, window.innerHeight - 120),
    });
  };

  const handleSelectIcon = (id: string) => {
    dispatch({ type: 'SELECT_ICON', id });
  };

  const handleOpenFolder = (id: string) => {
    dispatch({ type: 'OPEN', id });
  };

  return (
    <main
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
      className="relative w-screen h-screen overflow-hidden bg-[#008080] select-none text-black"
    >
      {/* Rejilla vertical de iconos en el escritorio (arriba a la izquierda) */}
      <div className="absolute top-2 left-2 flex flex-col flex-wrap gap-2 max-h-[calc(100vh-40px)] z-0 content-start">
        {desktopFolders.map((folder) => (
          <DesktopIcon
            key={folder.id}
            folder={folder}
            isSelected={state.selectedIconId === folder.id}
            onSelect={handleSelectIcon}
            onOpen={handleOpenFolder}
          />
        ))}
      </div>

      {/* Ventanas abiertas del sistema operativo */}
      {state.windows.map((win) => {
        const folder = findFolderById(win.id);
        if (!folder) return null;

        return (
          <Window key={win.id} windowState={win} folderDef={folder}>
            {win.id === 'games' ? (
              <GamesExplorer />
            ) : win.id === 'comments' ? (
              <TimelineAlbum />
            ) : win.id === 'our-love' ? (
              <OurLoveAlbum />
            ) : win.id === 'if-love-were-songs' ? (
              <MusicPlayerApp />
            ) : win.id === 'minesweeper' ? (
              <MinesweeperApp />
            ) : win.id === 'solitaire' ? (
              <SolitaireApp />
            ) : win.id === 'pinball' ? (
              <PinballApp />
            ) : win.id === 'purble-place' ? (
              <PurblePlaceApp />
            ) : win.id === 'voucher-validator' ? (
              <VoucherValidatorApp />
            ) : win.id === 'special-voucher' ? (
              <SpecialVoucherView />
            ) : folder.children && folder.children.length > 0 ? (
              <FolderExplorer folder={folder} />
            ) : (
              <FolderStub folder={folder} />
            )}
          </Window>
        );
      })}

      {/* Menú contextual (clic derecho) */}
      {state.contextMenu && <ContextMenu menu={state.contextMenu} />}

      {/* Menú Inicio */}
      <StartMenu isOpen={state.startMenuOpen} />

      {/* Barra de Tareas inferior */}
      <Taskbar />

      {/* Diálogo modal (MessageBox) */}
      {state.modal && <MessageBox modal={state.modal} />}
    </main>
  );
};

