import fs from 'fs';
import path from 'path';

// Registro secreto de los 18 códigos físicos de 10 dígitos y su número de voucher asignado
const VALID_VOUCHERS: Record<string, string> = {
  '7531968433': '01',
  '4476211118': '02',
  '6477357551': '03',
  '6658259402': '04',
  '1332678600': '05',
  '2587446272': '06',
  '7764708815': '07',
  '2843399441': '08',
  '6060249374': '09',
  '4949657603': '10',
  '4311525468': '11',
  '9158849356': '12',
  '3518917681': '13',
  '1116420189': '14',
  '8440632400': '15',
  '4578439512': '16',
  '1010736469': '17',
  '5152877116': '18',
};

const TOTAL_VOUCHERS = Object.keys(VALID_VOUCHERS).length; // 18

const SECRET_PRIZE = {
  title: 'VIAJE A SAN ANDRÉS ISLAS',
  titleEn: 'TRIP TO SAN ANDRÉS ISLANDS',
  redeemDate: '25 de noviembre de 2027',
  redeemDateEn: 'November 25, 2027',
};

// Ruta del archivo de persistencia en disco
const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'server', 'data', 'voucher-progress.json');

type PersistedState = {
  redeemedVouchers: string[]; // Números de voucher canjeados, e.g. ['01', '03']
  lastUpdated: string;
};

// Estado en memoria
let inMemoryState: PersistedState = {
  redeemedVouchers: [],
  lastUpdated: new Date().toISOString(),
};

// Carga inicial segura del archivo
try {
  if (fs.existsSync(DATA_FILE_PATH)) {
    const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.redeemedVouchers)) {
      inMemoryState = {
        redeemedVouchers: Array.from(new Set(parsed.redeemedVouchers)),
        lastUpdated: parsed.lastUpdated || new Date().toISOString(),
      };
    }
  }
} catch {
  // Entorno sin acceso al filesystem o error de lectura: continuar con estado en memoria
}

// Guardado seguro en disco
const persistState = () => {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(inMemoryState, null, 2), 'utf-8');
  } catch {
    // Si el entorno es de solo lectura (serverless), el estado se mantiene en memoria
  }
};

// Mutex simple para evitar canjes duplicados concurrentes
let isProcessing = false;
const withLock = async <T>(fn: () => Promise<T> | T): Promise<T> => {
  while (isProcessing) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  isProcessing = true;
  try {
    return await fn();
  } finally {
    isProcessing = false;
  }
};

// Control de fuerza bruta por IP
type AttemptRecord = {
  count: number;
  resetAt: number;
};
const ipAttempts = new Map<string, AttemptRecord>();

export const checkVoucherRateLimit = (ip: string): { allowed: boolean; retryAfter?: number } => {
  const now = Date.now();
  const record = ipAttempts.get(ip);

  if (!record || now > record.resetAt) {
    ipAttempts.set(ip, { count: 0, resetAt: now + 60 * 1000 });
    return { allowed: true };
  }

  if (record.count >= 12) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }

  return { allowed: true };
};

export const recordVoucherFailedAttempt = (ip: string) => {
  const now = Date.now();
  const record = ipAttempts.get(ip);
  if (!record || now > record.resetAt) {
    ipAttempts.set(ip, { count: 1, resetAt: now + 60 * 1000 });
  } else {
    record.count += 1;
  }
};

/**
 * Valida un código introducido sin canjearlo.
 */
export const validateVoucherCode = async (
  rawCode: string
): Promise<{
  valid: boolean;
  status: 'valid' | 'already_redeemed' | 'invalid_format' | 'not_found';
  voucherNumber?: string;
  error?: string;
}> => {
  const cleanCode = rawCode.trim();

  if (!/^\d{10}$/.test(cleanCode)) {
    return {
      valid: false,
      status: 'invalid_format',
      error: 'El código debe tener exactamente 10 dígitos numéricos.',
    };
  }

  const voucherNumber = VALID_VOUCHERS[cleanCode];
  if (!voucherNumber) {
    return {
      valid: false,
      status: 'not_found',
      error: 'Error: El código introducido no existe. Comprueba los números e inténtalo nuevamente.',
    };
  }

  if (inMemoryState.redeemedVouchers.includes(voucherNumber)) {
    return {
      valid: false,
      status: 'already_redeemed',
      voucherNumber,
      error: 'Este voucher ya fue canjeado anteriormente. ♡',
    };
  }

  return {
    valid: true,
    status: 'valid',
    voucherNumber,
  };
};

/**
 * Canjea un código de forma atómica y segura.
 */
export const redeemVoucherCode = async (
  rawCode: string
): Promise<{
  success: boolean;
  status: 'redeemed' | 'already_redeemed' | 'not_found' | 'invalid_format' | 'valid';
  voucherNumber?: string;
  redeemedCount: number;
  totalVouchers: number;
  isAllCompleted: boolean;
  error?: string;
}> => {
  return withLock(async () => {
    const validation = await validateVoucherCode(rawCode);

    if (!validation.valid) {
      return {
        success: false,
        status: validation.status,
        voucherNumber: validation.voucherNumber,
        redeemedCount: inMemoryState.redeemedVouchers.length,
        totalVouchers: TOTAL_VOUCHERS,
        isAllCompleted: inMemoryState.redeemedVouchers.length >= TOTAL_VOUCHERS,
        error: validation.error,
      };
    }

    const vNum = validation.voucherNumber!;
    if (!inMemoryState.redeemedVouchers.includes(vNum)) {
      inMemoryState.redeemedVouchers.push(vNum);
      inMemoryState.redeemedVouchers.sort((a, b) => Number(a) - Number(b));
      inMemoryState.lastUpdated = new Date().toISOString();
      persistState();
    }

    const count = inMemoryState.redeemedVouchers.length;
    const isAllCompleted = count >= TOTAL_VOUCHERS;

    return {
      success: true,
      status: 'redeemed',
      voucherNumber: vNum,
      redeemedCount: count,
      totalVouchers: TOTAL_VOUCHERS,
      isAllCompleted,
    };
  });
};

/**
 * Consulta el estado general de progreso (sin exponer códigos ni premios).
 */
export const getVoucherStatus = (): {
  redeemedCount: number;
  totalVouchers: number;
  redeemedVouchers: string[];
  isAllCompleted: boolean;
} => {
  const count = inMemoryState.redeemedVouchers.length;
  return {
    redeemedCount: count,
    totalVouchers: TOTAL_VOUCHERS,
    redeemedVouchers: [...inMemoryState.redeemedVouchers],
    isAllCompleted: count >= TOTAL_VOUCHERS,
  };
};

/**
 * Sincroniza el estado del cliente con el servidor (fusión de conjuntos).
 */
export const syncVoucherState = (
  clientRedeemedVouchers: string[]
): {
  redeemedCount: number;
  totalVouchers: number;
  redeemedVouchers: string[];
  isAllCompleted: boolean;
} => {
  if (Array.isArray(clientRedeemedVouchers)) {
    const validNumbers = new Set(Object.values(VALID_VOUCHERS));
    let hasChanges = false;

    for (const vNum of clientRedeemedVouchers) {
      if (typeof vNum === 'string' && validNumbers.has(vNum)) {
        if (!inMemoryState.redeemedVouchers.includes(vNum)) {
          inMemoryState.redeemedVouchers.push(vNum);
          hasChanges = true;
        }
      }
    }

    if (hasChanges) {
      inMemoryState.redeemedVouchers.sort((a, b) => Number(a) - Number(b));
      inMemoryState.lastUpdated = new Date().toISOString();
      persistState();
    }
  }

  return getVoucherStatus();
};

/**
 * Obtiene los datos del premio secreto ÚNICAMENTE cuando se han canjeado los 18 vouchers.
 */
export const getSpecialPrize = (): {
  success: boolean;
  prize?: typeof SECRET_PRIZE;
  error?: string;
} => {
  if (inMemoryState.redeemedVouchers.length < TOTAL_VOUCHERS) {
    return {
      success: false,
      error: 'Acceso no autorizado: debes canjear los 18 vouchers para desbloquear el premio.',
    };
  }

  return {
    success: true,
    prize: SECRET_PRIZE,
  };
};
