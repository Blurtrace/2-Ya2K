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
 * Inicializa y sincroniza el estado local con el backend Next.js.
 */
export const initAndSyncVouchers = async (): Promise<VoucherClientState> => {
  let local = getLocalVoucherState();

  // Intento de restaurar desde IndexedDB si localStorage fue borrado
  if (local.redeemedVouchers.length === 0) {
    const fromIdb = await loadFromIndexedDB();
    if (fromIdb && fromIdb.redeemedVouchers.length > 0) {
      local = saveLocalVoucherState(fromIdb);
    }
  }

  try {
    const res = await fetch('/api/vouchers/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ redeemedVouchers: local.redeemedVouchers }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.redeemedVouchers)) {
        const isAllCompleted = data.redeemedVouchers.length >= 18;
        const updated = saveLocalVoucherState({
          redeemedVouchers: data.redeemedVouchers,
          isSpecialUnlocked: isAllCompleted || local.isSpecialUnlocked,
        });

        // Si están todos completos y aún no tenemos el premio, consultarlo
        if (isAllCompleted && !updated.prizeData) {
          const prizeRes = await fetch('/api/vouchers/prize');
          if (prizeRes.ok) {
            const prizeData = await prizeRes.json();
            if (prizeData.success && prizeData.prize) {
              return saveLocalVoucherState({
                prizeData: prizeData.prize,
                isSpecialUnlocked: true,
              });
            }
          }
        }

        return updated;
      }
    }
  } catch {
    // Servidor inalcanzable temporalmente: confiar en estado local
  }

  return local;
};
