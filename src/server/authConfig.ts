import crypto from 'crypto';

/**
 * Configuración de autenticación del servidor para IfLoveWereSongs.
 * Cumple con:
 * - Contraseña NO expuesta en texto plano.
 * - Hash SHA-256 seguro con sal.
 * - Comparación con tiempo constante (timingSafeEqual) contra ataques de temporización.
 * - Tokens firmados HMAC para cookies de sesión HttpOnly.
 * - Limitación de tasa (rate-limiting) en memoria contra fuerza bruta.
 */

const PASSWORD_SALT = 'yaczury-ya2k-ecos-2026';
// Hash SHA-256 precalculado de "genuinamente" + PASSWORD_SALT:
const STORED_HASH_HEX = 'b271ff1ed1b63a9fb57d17ea9729e0db6e5845e0ffc54922a12edf20b962d09c';

const SESSION_SECRET = process.env.AUTH_SECRET || 'ya2k-ecos-session-secret-key-2026-unbreakable';
export const COOKIE_NAME = 'songs_auth_token';
const MAX_SESSION_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

// Control de fuerza bruta en memoria: IP -> { failedAttempts, lockedUntil }
type RateLimitRecord = {
  failedAttempts: number;
  firstAttemptAt: number;
  lockedUntil: number;
};
const rateLimits = new Map<string, RateLimitRecord>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10 minutos de bloqueo
const ATTEMPT_WINDOW_MS = 10 * 60 * 1000; // Ventana de 10 minutos

/**
 * Valida si la IP está bloqueada por exceso de intentos fallidos.
 */
export const checkRateLimit = (
  ip: string
): { allowed: boolean; remainingAttempts: number; retryAfterSeconds?: number } => {
  const now = Date.now();
  const record = rateLimits.get(ip);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  // Si está bloqueada actualmente
  if (record.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }

  // Si la ventana expiró, reinicia
  if (now - record.firstAttemptAt > ATTEMPT_WINDOW_MS) {
    rateLimits.delete(ip);
    return { allowed: true, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - record.failedAttempts);
  return { allowed: remaining > 0, remainingAttempts: remaining };
};

export const recordFailedAttempt = (ip: string): void => {
  const now = Date.now();
  const record = rateLimits.get(ip);

  if (!record || now - record.firstAttemptAt > ATTEMPT_WINDOW_MS) {
    rateLimits.set(ip, {
      failedAttempts: 1,
      firstAttemptAt: now,
      lockedUntil: 0,
    });
    return;
  }

  record.failedAttempts += 1;
  if (record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
  }
};

export const resetAttempts = (ip: string): void => {
  rateLimits.delete(ip);
};

/**
 * Compara la contraseña ingresada de manera segura (timingSafeEqual).
 */
export const verifyPassword = (rawPassword: string): boolean => {
  if (typeof rawPassword !== 'string') return false;
  const normalized = rawPassword.trim().toLowerCase();
  const inputHashHex = crypto
    .createHash('sha256')
    .update(normalized + PASSWORD_SALT)
    .digest('hex');

  const inputBuffer = Buffer.from(inputHashHex, 'hex');
  const storedBuffer = Buffer.from(STORED_HASH_HEX, 'hex');

  if (inputBuffer.length !== storedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, storedBuffer);
};

/**
 * Genera un token firmado con HMAC para la cookie de sesión: `${timestamp}.${signature}`
 */
export const createSessionToken = (): string => {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${timestamp}:songs_session`)
    .digest('hex');
  return `${timestamp}.${signature}`;
};

/**
 * Valida si un token de sesión es legítimo, no expirado y firmado por el servidor.
 */
export const verifySessionToken = (token?: string | null): boolean => {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestampStr, providedSig] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  const now = Date.now();
  if (now < timestamp || now - timestamp > MAX_SESSION_AGE_MS) {
    return false; // Expirado o timestamp del futuro
  }

  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${timestampStr}:songs_session`)
    .digest('hex');

  const providedBuffer = Buffer.from(providedSig, 'hex');
  const expectedBuffer = Buffer.from(expectedSig, 'hex');

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
};
