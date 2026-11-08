import type { OsState, OsAction, WindowState } from './types';

export const initialOsState: OsState = {
  windows: [],
  activeId: null,
  selectedIconId: null,
  startMenuOpen: false,
  nextZ: 10,
  modal: null,
  contextMenu: null,
  iconSortOrder: 'default',
  isRefreshing: false,
  recycledIds: [],
  guideOpen: true,
  guideMinimized: false,
  guideStep: 0,
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

      const isGames = action.id === 'games';
      const isComments = action.id === 'comments';
      const isOurLove = action.id === 'our-love';
      const isSongs = action.id === 'if-love-were-songs';
      const isMinesweeper = action.id === 'minesweeper';
      const isSolitaire = action.id === 'solitaire';
      const isPinball = action.id === 'pinball';
      const isPurblePlace = action.id === 'purble-place';
      const isVoucherValidator = action.id === 'voucher-validator';
      const isSpecialVoucher = action.id === 'special-voucher';
      const isMyComputer = action.id === 'my-computer';
      const isRecycleBin = action.id === 'recycle-bin';
      const isLarge = isGames || isComments || isOurLove || isSongs || isSolitaire || isPinball || isPurblePlace || isSpecialVoucher || isRecycleBin;

      const newWindow: WindowState = {
        id: action.id,
        x: isLarge ? Math.max(16, offsetX - 30) : isMinesweeper ? Math.max(100, offsetX) : offsetX,
        y: isLarge ? 16 : isMinesweeper ? 60 : offsetY,
        width: (isComments || isOurLove) ? 760 : isSongs ? 720 : isGames ? 740 : isPurblePlace ? 760 : isSpecialVoucher ? 620 : isRecycleBin ? 600 : isPinball ? 640 : isSolitaire ? 680 : isMyComputer ? 480 : isVoucherValidator ? 460 : isMinesweeper ? 212 : 440,
        height: (isComments || isOurLove) ? 620 : isSongs ? 620 : isGames ? 520 : isPurblePlace ? 560 : isSpecialVoucher ? 520 : isRecycleBin ? 420 : isPinball ? 540 : isSolitaire ? 520 : isMyComputer ? 320 : isVoucherValidator ? 420 : isMinesweeper ? 305 : 300,
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
      const targetWindow = state.windows.find((w) => w.id === action.id);
      // Solo omitir si ya es la activa Y NO está minimizada
      if (state.activeId === action.id && targetWindow && !targetWindow.minimized) {
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
        windows: state.windows.map((w) => {
          if (w.id !== action.id || w.maximized) return w;
          return { ...w, x: Math.max(0, action.x), y: Math.max(0, action.y) };
        }),
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

    case 'SET_ICON_SORT': {
      return {
        ...state,
        iconSortOrder: action.order,
        contextMenu: null,
      };
    }

    case 'START_REFRESH': {
      return {
        ...state,
        isRefreshing: true,
        selectedIconId: null,
        startMenuOpen: false,
        contextMenu: null,
      };
    }

    case 'END_REFRESH': {
      return {
        ...state,
        isRefreshing: false,
      };
    }

    case 'MOVE_TO_RECYCLE_BIN': {
      if (action.id === 'recycle-bin' || state.recycledIds.includes(action.id)) {
        return state;
      }
      const next = [...state.recycledIds, action.id];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('ECOS_RECYCLED_V1', JSON.stringify(next));
        } catch {}
      }
      return {
        ...state,
        recycledIds: next,
        selectedIconId: null,
      };
    }

    case 'RESTORE_FROM_RECYCLE_BIN': {
      const next = state.recycledIds.filter((id) => id !== action.id);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('ECOS_RECYCLED_V1', JSON.stringify(next));
        } catch {}
      }
      return {
        ...state,
        recycledIds: next,
      };
    }

    case 'RESTORE_ALL_FROM_RECYCLE_BIN': {
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('ECOS_RECYCLED_V1');
        } catch {}
      }
      return {
        ...state,
        recycledIds: [],
      };
    }

    case 'OPEN_GUIDE': {
      return {
        ...state,
        guideOpen: true,
        guideMinimized: false,
        guideStep: action.step !== undefined ? action.step : state.guideStep,
      };
    }

    case 'CLOSE_GUIDE': {
      return {
        ...state,
        guideOpen: false,
      };
    }

    case 'MINIMIZE_GUIDE': {
      return {
        ...state,
        guideMinimized: true,
      };
    }

    case 'RESTORE_GUIDE': {
      return {
        ...state,
        guideOpen: true,
        guideMinimized: false,
      };
    }

    case 'SET_GUIDE_STEP': {
      return {
        ...state,
        guideStep: Math.max(0, action.step),
      };
    }

    case 'TOGGLE_GUIDE': {
      if (!state.guideOpen || state.guideMinimized) {
        return {
          ...state,
          guideOpen: true,
          guideMinimized: false,
        };
      }
      return {
        ...state,
        guideOpen: false,
      };
    }

    default:
      return state;
  }
};

