import type { OsState, OsAction, WindowState } from './types';

export const initialOsState: OsState = {
  windows: [],
  activeId: null,
  selectedIconId: null,
  startMenuOpen: false,
  nextZ: 10,
  modal: null,
  contextMenu: null,
};

/**
 * Reducer puro del sistema operativo. Sin efectos secundarios, sin mutación ni clases.
 */
export const osReducer = (state: OsState, action: OsAction): OsState => {
  switch (action.type) {
    case 'OPEN': {
      const existing = state.windows.find((w) => w.id === action.id);
      if (existing) {
        // Si ya está abierta, la restaura si estaba minimizada y la enfoca
        const nextZ = state.nextZ + 1;
        return {
          ...state,
          activeId: action.id,
          nextZ,
          windows: state.windows.map((w) =>
            w.id === action.id
              ? { ...w, minimized: false, zIndex: nextZ }
              : w
          ),
          startMenuOpen: false,
          contextMenu: null,
        };
      }

      // Cálculo de cascada: +24px por ventana previa abierta
      const openCount = state.windows.length;
      const offsetX = 60 + (openCount % 8) * 24;
      const offsetY = 50 + (openCount % 8) * 24;
      const nextZ = state.nextZ + 1;

      const newWindow: WindowState = {
        id: action.id,
        x: offsetX,
        y: offsetY,
        width: 440,
        height: 300,
        zIndex: nextZ,
        minimized: false,
        maximized: false,
      };

      return {
        ...state,
        windows: [...state.windows, newWindow],
        activeId: action.id,
        nextZ,
        startMenuOpen: false,
        contextMenu: null,
      };
    }

    case 'CLOSE': {
      const remaining = state.windows.filter((w) => w.id !== action.id);
      let newActiveId: string | null = null;
      if (state.activeId === action.id) {
        // Activa la ventana visible con mayor zIndex restante
        const visibleRemaining = remaining.filter((w) => !w.minimized);
        if (visibleRemaining.length > 0) {
          const topWindow = visibleRemaining.reduce((highest, current) =>
            current.zIndex > highest.zIndex ? current : highest
          );
          newActiveId = topWindow.id;
        }
      } else {
        newActiveId = state.activeId;
      }

      return {
        ...state,
        windows: remaining,
        activeId: newActiveId,
        contextMenu: null,
      };
    }

    case 'FOCUS': {
      if (state.activeId === action.id) {
        return {
          ...state,
          startMenuOpen: false,
          contextMenu: null,
        };
      }
      const nextZ = state.nextZ + 1;
      return {
        ...state,
        activeId: action.id,
        nextZ,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? { ...w, minimized: false, zIndex: nextZ }
            : w
        ),
        startMenuOpen: false,
        contextMenu: null,
      };
    }

    case 'MINIMIZE': {
      const remainingVisible = state.windows.filter(
        (w) => w.id !== action.id && !w.minimized
      );
      let nextActiveId: string | null = null;
      if (remainingVisible.length > 0) {
        const top = remainingVisible.reduce((highest, current) =>
          current.zIndex > highest.zIndex ? current : highest
        );
        nextActiveId = top.id;
      }

      return {
        ...state,
        activeId: nextActiveId,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, minimized: true } : w
        ),
        startMenuOpen: false,
        contextMenu: null,
      };
    }

    case 'TOGGLE_MAXIMIZE': {
      const nextZ = state.nextZ + 1;
      return {
        ...state,
        activeId: action.id,
        nextZ,
        windows: state.windows.map((w) => {
          if (w.id !== action.id) return w;
          if (w.maximized) {
            // Restaurar a dimensiones y posición previas
            return {
              ...w,
              maximized: false,
              x: w.prev?.x ?? 80,
              y: w.prev?.y ?? 60,
              width: w.prev?.width ?? 440,
              height: w.prev?.height ?? 300,
              zIndex: nextZ,
            };
          }
          // Maximizar guardando estado previo
          return {
            ...w,
            maximized: true,
            prev: { x: w.x, y: w.y, width: w.width, height: w.height },
            zIndex: nextZ,
          };
        }),
      };
    }

    case 'MOVE': {
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? { ...w, x: Math.max(0, action.x), y: Math.max(0, action.y) }
            : w
        ),
      };
    }

    case 'SELECT_ICON': {
      return {
        ...state,
        selectedIconId: action.id,
        startMenuOpen: false,
        contextMenu: null,
      };
    }

    case 'TOGGLE_START': {
      return {
        ...state,
        startMenuOpen: !state.startMenuOpen,
        contextMenu: null,
      };
    }

    case 'CLOSE_START': {
      return {
        ...state,
        startMenuOpen: false,
      };
    }

    case 'OPEN_CONTEXT_MENU': {
      return {
        ...state,
        startMenuOpen: false,
        contextMenu: {
          isOpen: true,
          x: action.x,
          y: action.y,
        },
      };
    }

    case 'CLOSE_CONTEXT_MENU': {
      return {
        ...state,
        contextMenu: null,
      };
    }

    case 'SHOW_MODAL': {
      return {
        ...state,
        modal: {
          isOpen: true,
          ...action.modal,
        },
        startMenuOpen: false,
        contextMenu: null,
      };
    }

    case 'CLOSE_MODAL': {
      return {
        ...state,
        modal: null,
      };
    }

    default:
      return state;
  }
};

