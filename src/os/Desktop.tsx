'use client';

import React from 'react';
import { useOs } from './state/OsContext';
import { getDesktopFolders, findFolderById } from '@/folders/registry';
import { DesktopIcon } from './DesktopIcon';
import { Window } from './Window';
import { FolderExplorer } from './FolderExplorer';
import { FolderStub } from './FolderStub';
import { GamesExplorer } from '@/folders/Games/GamesExplorer';
import { TimelineAlbum } from '@/folders/Comments/TimelineAlbum';
import { MusicPlayerApp } from '@/folders/IfLoveWereSongs/MusicPlayerApp';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { ContextMenu } from './ContextMenu';
import { MessageBox } from './MessageBox';

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
            ) : win.id === 'if-love-were-songs' ? (
              <MusicPlayerApp />
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

