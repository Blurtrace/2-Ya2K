import type React from 'react';

/**
 * Definición pura de datos para una carpeta o funcionalidad del sistema operativo.
 * Cumple la regla innegociable de no utilizar clases ni herencia.
 */
export type FolderDef = {
  id: string;
  nameKey: string;                       // Clave i18n, p. ej. 'folder.bankOfMemories'
  icon: string;                          // Ruta relativa en /public/icons
  status: 'planned' | 'ready';           // 'planned' = stub en construcción
  component?: () => Promise<{ default: React.ComponentType }>; // Componente cargado dinámicamente
  children?: FolderDef[];                // Subcarpetas cuando actúa como explorador contenedor
  hidden?: boolean;                      // Ocultar del escritorio principal
};

/**
 * Estado geométrico y de visualización de una ventana en pantalla.
 */
export type WindowState = {
  id: string;                            // Identificador de la carpeta asociada
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  prev?: { x: number; y: number; width: number; height: number }; // Respaldo para restaurar
};

/**
 * Estado de diálogos modales (MessageBox de advertencia, info o broma de apagado).
 */
export type ModalState = {
  isOpen: boolean;
  titleKey: string;
  messageKey: string;
  icon?: string;
  type?: 'info' | 'warning' | 'error';
  onConfirm?: () => void;
};

/**
 * Estado del menú contextual al hacer clic derecho en el escritorio.
 */
export type ContextMenuState = {
  isOpen: boolean;
  x: number;
  y: number;
};

export type IconSortOrder = 'default' | 'name' | 'type';

/**
 * Estado global inmutable del sistema operativo ECOS.
 */
export type OsState = {
  windows: WindowState[];
  activeId: string | null;
  selectedIconId: string | null;
  startMenuOpen: boolean;
  nextZ: number;
  modal: ModalState | null;
  contextMenu: ContextMenuState | null;
  iconSortOrder: IconSortOrder;
  isRefreshing: boolean;
};

/**
 * Acciones despachables al reducer puro del sistema.
 */
export type OsAction =
  | { type: 'OPEN'; id: string }
  | { type: 'CLOSE'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'MINIMIZE'; id: string }
  | { type: 'TOGGLE_MAXIMIZE'; id: string }
  | { type: 'MOVE'; id: string; x: number; y: number }
  | { type: 'SELECT_ICON'; id: string | null }
  | { type: 'TOGGLE_START' }
  | { type: 'CLOSE_START' }
  | { type: 'OPEN_CONTEXT_MENU'; x: number; y: number }
  | { type: 'CLOSE_CONTEXT_MENU' }
  | { type: 'SHOW_MODAL'; modal: Omit<ModalState, 'isOpen'> }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_ICON_SORT'; order: IconSortOrder }
  | { type: 'START_REFRESH' }
  | { type: 'END_REFRESH' };

