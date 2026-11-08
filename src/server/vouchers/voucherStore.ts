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
const ALL_VOUCHER_NUMBERS = new Set(Object.values(VALID_VOUCHERS));

const SECRET_PRIZE = {
  title: 'VIAJE A SAN ANDRÉS ISLAS',
  titleEn: 'TRIP TO SAN ANDRÉS ISLANDS',
  redeemDate: '25 de noviembre de 2027',
  redeemDateEn: 'November 25, 2027',
};

// Control de tasa de peticiones (anti fuerza bruta) por IP
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

  if (record.count >= 15) {
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
 * Valida un código introducido verificando contra el progreso del dispositivo cliente.
 * Cada dispositivo/navegador mantiene su propia sesión independiente.
 */
export const validateVoucherCode = async (
  rawCode: string,
  clientRedeemed: string[] = []
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

  // Comprobar si ya fue canjeado en este dispositivo
  if (Array.isArray(clientRedeemed) && clientRedeemed.includes(voucherNumber)) {
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
 * Canjea un código para el dispositivo cliente.
 */
export const redeemVoucherCode = async (
  rawCode: string,
  clientRedeemed: string[] = []
): Promise<{
  success: boolean;
  status: 'redeemed' | 'already_redeemed' | 'not_found' | 'invalid_format' | 'valid';
  voucherNumber?: string;
  redeemedCount: number;
  totalVouchers: number;
  isAllCompleted: boolean;
  error?: string;
}> => {
  const validation = await validateVoucherCode(rawCode, clientRedeemed);

  if (!validation.valid) {
    const currentCount = Array.isArray(clientRedeemed) ? clientRedeemed.length : 0;
    return {
      success: false,
      status: validation.status,
      voucherNumber: validation.voucherNumber,
      redeemedCount: currentCount,
      totalVouchers: TOTAL_VOUCHERS,
      isAllCompleted: currentCount >= TOTAL_VOUCHERS,
      error: validation.error,
    };
  }

  const vNum = validation.voucherNumber!;
  const nextSet = new Set(Array.isArray(clientRedeemed) ? clientRedeemed : []);
  nextSet.add(vNum);

  const nextCount = nextSet.size;
  const isAllCompleted = nextCount >= TOTAL_VOUCHERS;

  return {
    success: true,
    status: 'redeemed',
    voucherNumber: vNum,
    redeemedCount: nextCount,
    totalVouchers: TOTAL_VOUCHERS,
    isAllCompleted,
  };
};

/**
 * Obtiene los datos del premio secreto ÚNICAMENTE cuando el dispositivo cliente
 * acredita haber canjeado los 18 vouchers válidos.
 */
export const getSpecialPrizeForClient = (
  clientRedeemed: string[] = []
): {
  success: boolean;
  prize?: typeof SECRET_PRIZE;
  error?: string;
} => {
  if (!Array.isArray(clientRedeemed)) {
    return {
      success: false,
      error: 'Lista de canjes inválida.',
    };
  }

  // Verificar que el cliente tenga exactamente los 18 números válidos del 01 al 18
  const clientSet = new Set(clientRedeemed);
  let validMatches = 0;
  for (const num of ALL_VOUCHER_NUMBERS) {
    if (clientSet.has(num)) {
      validMatches++;
    }
  }

  if (validMatches < TOTAL_VOUCHERS) {
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
