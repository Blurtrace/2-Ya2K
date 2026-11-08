'use client';

export type VoucherClientState = {
  redeemedVouchers: string[];
  isSpecialUnlocked: boolean;
  isSpecialOpened: boolean;
  isPrizeRevealed: boolean;
  revealedAt?: string;
  prizeData?: {
    title: string;
    titleEn?: string;
    redeemDate: string;
    redeemDateEn?: string;
  };
};

const STORAGE_KEY = 'ECOS_VOUCHERS_PROGRESS_V1';
const DB_NAME = 'ecos_vouchers_db';
const DB_VERSION = 1;
const STORE_NAME = 'progress';

const defaultState: VoucherClientState = {
  redeemedVouchers: [],
  isSpecialUnlocked: false,
  isSpecialOpened: false,
  isPrizeRevealed: false,
};

// IndexedDB Helper
const openIndexedDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB no soportado'));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveToIndexedDB = async (state: VoucherClientState) => {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(state, 'current');
  } catch {
    // Si falla IndexedDB, localStorage sigue protegiendo los datos
  }
};

const loadFromIndexedDB = async (): Promise<VoucherClientState | null> => {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get('current');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
};

/**
 * Obtiene el estado actual local (localStorage + IndexedDB).
 */
export const getLocalVoucherState = (): VoucherClientState => {
  if (typeof window === 'undefined') return defaultState;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultState,
        ...parsed,
        redeemedVouchers: Array.from(new Set(parsed.redeemedVouchers || [])),
      };
    }
  } catch {
    // Error al leer localStorage
  }

  return defaultState;
};

/**
 * Guarda el estado en ambos motores locales (localStorage e IndexedDB).
 */
export const saveLocalVoucherState = (partial: Partial<VoucherClientState>): VoucherClientState => {
  const current = getLocalVoucherState();
  const next: VoucherClientState = {
    ...current,
    ...partial,
    redeemedVouchers: Array.from(
      new Set(partial.redeemedVouchers ? partial.redeemedVouchers : current.redeemedVouchers)
    ).sort((a, b) => Number(a) - Number(b)),
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignorar quota exceeded
    }
    saveToIndexedDB(next);
  }

  return next;
};

/**
 * Inicializa y restaura el estado local independiente de este dispositivo (localStorage + IndexedDB).
 */
export const initAndSyncVouchers = async (): Promise<VoucherClientState> => {
  let local = getLocalVoucherState();

  // Intento de restaurar desde IndexedDB si localStorage fue borrado en este navegador
  if (local.redeemedVouchers.length === 0) {
    const fromIdb = await loadFromIndexedDB();
    if (fromIdb && fromIdb.redeemedVouchers.length > 0) {
      local = saveLocalVoucherState(fromIdb);
    }
  }

  // Si este dispositivo ya completó los 18 canjes y aún no tiene el premio cargado, solicitarlo
  if (local.redeemedVouchers.length >= 18 && !local.prizeData) {
    try {
      const prizeRes = await fetch('/api/vouchers/prize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentRedeemed: local.redeemedVouchers }),
      });
      if (prizeRes.ok) {
        const prizeData = await prizeRes.json();
        if (prizeData.success && prizeData.prize) {
          local = saveLocalVoucherState({
            prizeData: prizeData.prize,
            isSpecialUnlocked: true,
          });
        }
      }
    } catch {
      // Servidor inalcanzable temporalmente
    }
  }

  return local;
};
