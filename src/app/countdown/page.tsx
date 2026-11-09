'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useT } from '@/i18n/I18nContext';
import { GuideCharacter } from '@/guide/GuideCharacter';

// Fecha y hora objetivo: 10 de noviembre de 2026, 00:00:00 hora de Colombia (Bogotá, UTC-5)
const TARGET_TIMESTAMP_MS = Date.parse('2026-11-10T00:00:00-05:00');
const PREVIEW_SECRET = '91588493564949657603';

export default function CountdownPage() {
  const router = useRouter();
  const { lang, setLang, t } = useT();

  const [remainingMs, setRemainingMs] = useState<number>(() => Math.max(0, TARGET_TIMESTAMP_MS - Date.now()));
  const [bogotaTimeText, setBogotaTimeText] = useState<string>('--:--:--');
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [developerKey, setDeveloperKey] = useState('');
  const [developerError, setDeveloperError] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const serverOffsetRef = useRef<number>(0);

  const triggerUnlock = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push('/');
    }, 3500);
  }, [router]);

  // Sincronizar con el reloj real del servidor para evitar discrepancias locales
  const syncServerTime = useCallback(async () => {
    try {
      const res = await fetch('/api/time', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const clientNow = Date.now();
        serverOffsetRef.current = data.serverTime - clientNow;
        const currentServerNow = clientNow + serverOffsetRef.current;
        const diff = data.targetTime - currentServerNow;

        if (diff <= 0 || data.unlocked) {
          triggerUnlock();
        } else {
          setRemainingMs(diff);
          setSyncStatus(
            new Date(currentServerNow).toLocaleTimeString('es-CO', {
              timeZone: 'America/Bogota',
              hour12: true,
            })
          );
        }
      }
    } catch {
      // Fallback a hora local
    }
  }, [triggerUnlock]);

  useEffect(() => {
    syncServerTime();

    // Actualización rápida (cada 50ms) para fluidez de centésimas de segundo
    const interval = setInterval(() => {
      const currentNow = Date.now() + serverOffsetRef.current;
      const diff = TARGET_TIMESTAMP_MS - currentNow;

      // Formatear hora de Bogotá para la telemetría retro
      const bDate = new Date(currentNow);
      setBogotaTimeText(
        bDate.toLocaleTimeString('es-CO', {
          timeZone: 'America/Bogota',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );

      if (diff <= 0) {
        clearInterval(interval);
        setRemainingMs(0);
        triggerUnlock();
      } else {
        setRemainingMs(diff);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [syncServerTime, triggerUnlock]);

  // Cálculos de tiempo
  const totalSeconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const hundredths = Math.floor((remainingMs % 1000) / 10);

  const pad = (n: number, len = 2) => String(n).padStart(len, '0');

  // Manejo del acceso secreto de desarrollador para Jandy
  const handleDeveloperSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (developerKey.trim() === PREVIEW_SECRET) {
      // Redirigir usando el parámetro que el middleware captura y convierte en cookie
      window.location.href = '/?preview=' + encodeURIComponent(PREVIEW_SECRET);
    } else {
      setDeveloperError(true);
    }
  };

  return (
    <main className="relative w-screen h-screen bg-[#008080] text-black flex items-center justify-center p-3 select-none overflow-auto font-sans">
      {/* Patrón sutil retro de líneas de escaneo CRT en fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* ================= CONTENEDOR DE TRANSICIÓN Y2K AL DESBLOQUEAR ================= */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="win-raised bg-[#C0C0C0] p-6 max-w-[480px] shadow-2xl border-2 border-white flex flex-col items-center">
            <span className="text-5xl mb-3 animate-bounce">🎆</span>
            <h1 className="text-xl sm:text-2xl font-black text-[#000080] mb-2 uppercase tracking-wider font-mono">
              {t('countdown.welcome2000')}
            </h1>
            <p className="text-[12px] text-black font-mono leading-relaxed whitespace-pre-wrap mb-4 font-bold">
              {t('countdown.transitioning')}
            </p>
            <div className="w-full win-sunken bg-black p-2 flex items-center justify-center">
              <span className="text-[#00FF41] font-mono text-sm animate-pulse">
                [ 1999 ➔ 2000 ] SISTEMA TOTALMENTE OPERATIVO
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================= VENTANA PRINCIPAL RETRO WINDOWS 98 / Y2K ================= */}
      <div className="relative w-full max-w-[560px] win-raised bg-[#C0C0C0] p-1 shadow-2xl border border-[#A0A0A0] flex flex-col z-10 my-auto">
        {/* Barra de título azul marino Windows 98 */}
        <div className="bg-gradient-to-r from-[#000080] to-[#1084D0] text-white px-2 py-1 flex items-center justify-between text-[11px] font-bold select-none">
          <div className="flex items-center space-x-1.5 truncate">
            <span>⏳</span>
            <span className="truncate">{t('countdown.windowTitle')}</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Selector de idioma ES / EN */}
            <button
              type="button"
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="win-raised active:win-pressed px-1.5 py-0.5 bg-[#C0C0C0] text-black text-[9px] font-bold uppercase hover:bg-[#D4D0C8] cursor-pointer"
              title="Cambiar idioma / Switch language"
            >
              {t('countdown.switchLang')}
            </button>
            <span className="text-[10px] text-white/80 font-mono font-normal">ECOS 98</span>
          </div>
        </div>

        {/* Cuerpo de la ventana */}
        <div className="p-3 sm:p-4 flex flex-col gap-3">
          {/* Banner de Cabecera Y2K */}
          <div className="win-sunken bg-[#050510] text-[#00F0FF] p-2 flex items-center justify-between border border-[#004060]">
            <div className="flex items-center space-x-2">
              <span className="inline-block w-2.5 h-2.5 bg-[#00FF41] animate-ping" />
              <span className="font-mono text-[10.5px] font-bold tracking-wider uppercase">
                {t('countdown.badgeY2K')}
              </span>
            </div>
            <div className="font-mono text-[10px] text-[#FFD700] tracking-widest font-black">
              1999 ➔ 2000
            </div>
          </div>

          {/* ================= DISPLAY PRINCIPAL DE CONTEO REGRESIVO ================= */}
          <div className="win-sunken bg-[#0A0A0A] p-3 sm:p-4 border-2 border-[#1A1A1A] shadow-inner flex flex-col items-center">
            <span className="text-[#888888] font-mono text-[9px] tracking-widest uppercase mb-1.5">
              {t('countdown.statusWaiting')}
            </span>

            {/* Cajas digitales VFD / LED verde fósforo */}
            <div className="flex items-baseline justify-center gap-1 sm:gap-2 font-mono select-none">
              {/* DÍAS */}
              <div className="flex flex-col items-center">
                <div className="bg-[#001408] border border-[#005020] px-2 py-1 text-[#00FF41] font-black text-2xl sm:text-4xl shadow-[0_0_12px_rgba(0,255,65,0.4)]">
                  {pad(days, 2)}
                </div>
                <span className="text-[9px] font-bold text-[#00B030] mt-1 tracking-wider">
                  {t('countdown.days')}
                </span>
              </div>

              <span className="text-[#00FF41] font-black text-xl sm:text-3xl animate-pulse">:</span>

              {/* HORAS */}
              <div className="flex flex-col items-center">
                <div className="bg-[#001408] border border-[#005020] px-2 py-1 text-[#00FF41] font-black text-2xl sm:text-4xl shadow-[0_0_12px_rgba(0,255,65,0.4)]">
                  {pad(hours, 2)}
                </div>
                <span className="text-[9px] font-bold text-[#00B030] mt-1 tracking-wider">
                  {t('countdown.hours')}
                </span>
              </div>

              <span className="text-[#00FF41] font-black text-xl sm:text-3xl animate-pulse">:</span>

              {/* MINUTOS */}
              <div className="flex flex-col items-center">
                <div className="bg-[#001408] border border-[#005020] px-2 py-1 text-[#00FF41] font-black text-2xl sm:text-4xl shadow-[0_0_12px_rgba(0,255,65,0.4)]">
                  {pad(minutes, 2)}
                </div>
                <span className="text-[9px] font-bold text-[#00B030] mt-1 tracking-wider">
                  {t('countdown.minutes')}
                </span>
              </div>

              <span className="text-[#00FF41] font-black text-xl sm:text-3xl animate-pulse">:</span>

              {/* SEGUNDOS */}
              <div className="flex flex-col items-center">
                <div className="bg-[#001408] border border-[#005020] px-2 py-1 text-[#00FF41] font-black text-2xl sm:text-4xl shadow-[0_0_12px_rgba(0,255,65,0.4)]">
                  {pad(seconds, 2)}
                </div>
                <span className="text-[9px] font-bold text-[#00B030] mt-1 tracking-wider">
                  {t('countdown.seconds')}
                </span>
              </div>

              <span className="text-[#00FF41] font-black text-lg sm:text-2xl opacity-60">.</span>

              {/* CENTÉSIMAS / MILISEGUNDOS */}
              <div className="flex flex-col items-center">
                <div className="bg-[#001408] border border-[#005020] px-1.5 py-1 text-[#00FF41]/80 font-black text-base sm:text-2xl shadow-[0_0_8px_rgba(0,255,65,0.3)]">
                  {pad(hundredths, 2)}
                </div>
                <span className="text-[8px] font-bold text-[#00B030]/80 mt-1">
                  {t('countdown.milliseconds')}
                </span>
              </div>
            </div>
          </div>

          {/* ================= ASISTENTE TATA Y GLOBO DE MENSAJE ================= */}
          <div className="win-sunken bg-white p-2.5 flex items-start gap-3 border border-[#808080]">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="p-1 win-raised bg-[#C0C0C0] mb-1">
                <GuideCharacter character="tata" pose={0} size="md" />
              </div>
              <span className="text-[9px] font-bold text-[#000080] win-sunken bg-[#EAEAEA] px-1.5 py-0.5">
                TATA (V)
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="win-sunken bg-[#FFFFE5] p-2 text-black text-[11px] leading-relaxed border border-[#A0A080] shadow-sm">
                <p className="font-sans font-medium text-black">
                  &ldquo;{t('countdown.tataBubble')}&rdquo;
                </p>
              </div>

              <div className="mt-2 text-[10px] text-neutral-600 font-sans leading-tight">
                <strong className="text-[#000080] block mb-0.5">
                  {t('countdown.explanationTitle')}:
                </strong>
                {t('countdown.explanationText')}
              </div>
            </div>
          </div>

          {/* ================= CONSOLA DE TELEMETRÍA BOGOTÁ Y2K ================= */}
          <div className="win-sunken bg-black text-[#00FF41] p-2 font-mono text-[9.5px] leading-relaxed overflow-x-auto select-text">
            <div>&gt; {t('countdown.targetDate')}</div>
            <div>&gt; {t('countdown.currentTime')} {bogotaTimeText} (COT • America/Bogota)</div>
            <div>&gt; PROTOCOLO ECOS 98: CALIBRACIÓN ACTIVA HASTA EL MILENIO.</div>
            {syncStatus && (
              <div className="text-[#00F0FF] mt-0.5">
                &gt; {t('countdown.syncSuccess', { time: syncStatus })}
              </div>
            )}
          </div>

          {/* ================= BOTONES DE ACCIÓN INFERIORES ================= */}
          <div className="flex items-center justify-between pt-1 text-[11px]">
            <button
              type="button"
              onClick={syncServerTime}
              className="win-raised active:win-pressed px-2.5 py-1 bg-[#C0C0C0] text-black text-[10px] font-bold flex items-center space-x-1 cursor-pointer hover:bg-[#D4D0C8]"
            >
              <span>{t('countdown.syncButton')}</span>
            </button>

            {/* Acceso de desarrollador discreto para Jandy */}
            <button
              type="button"
              onClick={() => setShowDeveloperModal(true)}
              className="text-[#606060] hover:text-[#000080] text-[9.5px] font-mono underline cursor-pointer"
            >
              🔑 {t('countdown.developerAccess')}
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL DE ACCESO DE PREVIEW (JANDY) ================= */}
      {showDeveloperModal && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-3 animate-fade-in">
          <div className="w-full max-w-[360px] win-raised bg-[#C0C0C0] p-1 shadow-2xl border border-[#A0A0A0] flex flex-col">
            <div className="bg-[#000080] text-white px-2 py-0.5 flex items-center justify-between text-[11px] font-bold">
              <span>🔑 Acceso Anticipado — ECOS 98</span>
              <button
                type="button"
                onClick={() => {
                  setShowDeveloperModal(false);
                  setDeveloperError(false);
                  setDeveloperKey('');
                }}
                className="win-raised w-4 h-4 flex items-center justify-center bg-[#C0C0C0] text-black text-[10px] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDeveloperSubmit} className="p-3 flex flex-col gap-2.5">
              <p className="text-[11px] text-black font-sans leading-normal">
                {t('countdown.developerPrompt')}
              </p>

              <input
                type="password"
                autoFocus
                value={developerKey}
                onChange={(e) => {
                  setDeveloperKey(e.target.value);
                  setDeveloperError(false);
                }}
                placeholder="Clave de desarrollador..."
                className="win-sunken bg-white px-2 py-1 text-black font-mono text-[11px] outline-none"
              />

              {developerError && (
                <span className="text-[#800000] text-[10px] font-bold">
                  {t('countdown.developerInvalid')}
                </span>
              )}

              <div className="flex justify-end gap-2 mt-2 pt-1 border-t border-[#808080]">
                <button
                  type="submit"
                  className="win-raised active:win-pressed px-3 py-1 bg-[#C0C0C0] text-black font-bold text-[11px] cursor-pointer"
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeveloperModal(false)}
                  className="win-raised active:win-pressed px-3 py-1 bg-[#C0C0C0] text-black text-[11px] cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
