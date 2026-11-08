'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useOs } from '@/os/state/OsContext';
import { useT } from '@/i18n/I18nContext';
import {
  getLocalVoucherState,
  saveLocalVoucherState,
  initAndSyncVouchers,
  type VoucherClientState,
} from './voucherStorage';

export const VoucherValidatorApp = () => {
  const { dispatch } = useOs();
  const { t } = useT();

  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [state, setState] = useState<VoucherClientState>(getLocalVoucherState);

  // Modales y estados de diálogo
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pendingValidation, setPendingValidation] = useState<{
    code: string;
    voucherNumber: string;
    message: string;
  } | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Sincronizar al montar
  useEffect(() => {
    let isMounted = true;
    initAndSyncVouchers().then((synced) => {
      if (isMounted) {
        setState(synced);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const redeemedCount = state.redeemedVouchers.length;
  const isAllComplete = redeemedCount >= 18;

  // Manejo de entrada: sólo 10 dígitos numéricos
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setCode(raw);
    if (errorMessage) setErrorMessage(null);
    if (successMessage) setSuccessMessage(null);
  };

  // 1. Paso de validación previa
  const handleValidate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (code.length !== 10 || isValidating || isRedeeming) return;

    setIsValidating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/vouchers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, currentRedeemed: state.redeemedVouchers }),
      });

      const data = await res.json().catch(() => ({}));

      if (data.success && data.status === 'valid') {
        setPendingValidation({
          code,
          voucherNumber: data.voucherNumber,
          message: data.message || t('voucher.validFound'),
        });
      } else {
        setErrorMessage(data.error || t('voucher.errorInexistent'));
      }
    } catch {
      setErrorMessage(t('voucher.errorConnection'));
    } finally {
      setIsValidating(false);
    }
  };

  // 2. Paso de confirmación de canje
  const handleConfirmRedeem = async () => {
    if (!pendingValidation || isRedeeming) return;

    setIsRedeeming(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/vouchers/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: pendingValidation.code,
          currentRedeemed: state.redeemedVouchers,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (data.success && data.status === 'redeemed') {
        const nextRedeemed = Array.from(
          new Set([...state.redeemedVouchers, data.voucherNumber])
        ).sort((a, b) => Number(a) - Number(b));

        const isNowAllComplete = nextRedeemed.length >= 18;
        const updated = saveLocalVoucherState({
          redeemedVouchers: nextRedeemed,
          isSpecialUnlocked: isNowAllComplete || state.isSpecialUnlocked,
        });

        setState(updated);
        setPendingValidation(null);
        setCode('');
        setSuccessMessage(t('voucher.redeemSuccess'));

        // Si se completaron los 18, solicitar premio y mostrar celebración
        if (isNowAllComplete) {
          fetch('/api/vouchers/prize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentRedeemed: nextRedeemed }),
          })
            .then((r) => r.json())
            .then((pData) => {
              if (pData.success && pData.prize) {
                saveLocalVoucherState({
                  prizeData: pData.prize,
                  isSpecialUnlocked: true,
                });
              }
            })
            .catch(() => {});

          setShowCelebration(true);
        }
      } else {
        setErrorMessage(data.error || t('voucher.errorGeneric'));
        setPendingValidation(null);
      }
    } catch {
      setErrorMessage(t('voucher.errorConnection'));
      setPendingValidation(null);
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleCancelConfirm = () => {
    setPendingValidation(null);
  };

  // Abrir voucher especial
  const handleOpenSpecialVoucher = useCallback(() => {
    dispatch({ type: 'OPEN', id: 'special-voucher' });
  }, [dispatch]);

  const handleUseNow = () => {
    setShowCelebration(false);
    saveLocalVoucherState({ isSpecialOpened: true });
    handleOpenSpecialVoucher();
  };

  const handleUseLater = () => {
    setShowCelebration(false);
  };

  return (
    <div className="flex-1 flex flex-col p-3 bg-[#C0C0C0] text-black select-none font-sans min-h-[380px] justify-between relative">
      {/* Contenedor principal de la aplicación */}
      <div className="flex flex-col gap-3">
        {/* Cabecera estilo diálogo Windows 98 con icono retro */}
        <div className="bg-[#C0C0C0] win-raised p-2.5 flex items-start gap-3">
          <div className="w-9 h-9 flex-shrink-0 relative flex items-center justify-center">
            <Image
              src="/icons/voucher.png"
              alt="Voucher"
              width={32}
              height={32}
              className="pixelated"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[12px] text-black leading-tight">
              {t('voucher.appTitle')}
            </h3>
            <p className="text-[11px] text-neutral-800 mt-1 leading-snug">
              {t('voucher.instruction')}
            </p>
          </div>
        </div>

        {/* Formulario de introducción de código */}
        <form
          onSubmit={handleValidate}
          className="bg-[#C0C0C0] win-raised p-3 flex flex-col gap-2.5"
        >
          <div className="flex flex-col gap-1">
            <label
              htmlFor="voucher-code-input"
              className="text-[11px] font-bold text-black"
            >
              {t('voucher.codeLabel')}
            </label>
            <div className="flex items-center gap-2">
              <input
                id="voucher-code-input"
                type="text"
                inputMode="numeric"
                autoFocus
                value={code}
                onChange={handleCodeChange}
                placeholder="0000000000"
                disabled={isValidating || isRedeeming}
                maxLength={10}
                className="flex-1 win-sunken bg-white px-3 py-1.5 text-center font-mono text-[14px] sm:text-[15px] tracking-[0.25em] text-black font-bold outline-none focus:bg-[#FFFFE1]"
              />
              <button
                type="submit"
                disabled={code.length !== 10 || isValidating || isRedeeming}
                className="win-raised active:win-pressed px-3 py-1.5 text-[11px] font-bold bg-[#C0C0C0] text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[110px]"
              >
                {isValidating ? t('voucher.validating') : t('voucher.validateButton')}
              </button>
            </div>
          </div>

          {/* Mensajes de error o éxito inline */}
          {errorMessage && (
            <div className="text-[11px] text-red-800 bg-red-100 win-sunken px-2.5 py-1 flex items-center gap-1.5 font-sans">
              <span className="text-sm">⚠️</span>
              <span className="leading-tight">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="text-[11px] text-emerald-900 bg-emerald-100 win-sunken px-2.5 py-1 flex items-center gap-1.5 font-sans">
              <span className="text-sm">✨</span>
              <span className="leading-tight font-semibold">{successMessage}</span>
            </div>
          )}
        </form>

        {/* Sección de progreso de canjes */}
        <div className="bg-[#C0C0C0] win-raised p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-black">
            <span>{t('voucher.counterLabel', { count: redeemedCount, total: 18 })}</span>
            {isAllComplete && (
              <span className="text-[#000080] font-bold tracking-wide">
                🎉 {t('voucher.allCompletedLabel')}
              </span>
            )}
          </div>

          {/* Barra de progreso segmentada clásica de Windows 98 */}
          <div
            className="win-sunken bg-white p-[2px] h-6 flex gap-[2px] overflow-hidden"
            title={`${redeemedCount} de 18`}
          >
            {Array.from({ length: 18 }).map((_, i) => {
              const isFilled = i < redeemedCount;
              return (
                <div
                  key={i}
                  className={`flex-1 h-full transition-none ${
                    isFilled ? 'bg-[#000080]' : 'bg-transparent'
                  }`}
                />
              );
            })}
          </div>

          {/* Acceso directo al voucher especial una vez desbloqueado */}
          {(state.isSpecialUnlocked || isAllComplete) && (
            <div className="mt-2 pt-2 border-t border-[#808080] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#5A0017]">
                <span>🎁</span>
                <span>{t('voucher.specialUnlockedBanner')}</span>
              </div>
              <button
                onClick={handleOpenSpecialVoucher}
                className="win-raised active:win-pressed px-3 py-1 bg-[#C0C0C0] text-black text-[11px] font-bold cursor-pointer hover:bg-[#D4D0C8]"
              >
                {t('voucher.openSpecialButton')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pie de estado de Windows 98 */}
      <div className="win-sunken bg-[#C0C0C0] px-2 py-0.5 text-[10px] text-neutral-800 flex justify-between items-center mt-2">
        <span>{t('voucher.statusReady')}</span>
        <span>{isAllComplete ? '18/18 (100%)' : `${Math.round((redeemedCount / 18) * 100)}%`}</span>
      </div>

      {/* ================= MODAL DE CONFIRMACIÓN DE CANJE ================= */}
      {pendingValidation && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center p-3">
          <div className="w-full max-w-[380px] bg-[#C0C0C0] win-raised p-1 shadow-lg border border-[#a0a0a0] flex flex-col">
            {/* Barra de título del modal */}
            <div className="bg-[#000080] text-white px-2 py-0.5 flex items-center justify-between text-[11px] font-bold">
              <div className="flex items-center space-x-1.5 truncate">
                <span>❓</span>
                <span>{t('voucher.confirmDialogTitle')}</span>
              </div>
              <button
                onClick={handleCancelConfirm}
                className="win-raised w-4 h-4 flex items-center justify-center bg-[#C0C0C0] text-black text-[10px] font-bold leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="text-3xl select-none">🎫</div>
                <div className="flex-1 text-[11px] text-black font-sans leading-relaxed">
                  <p className="font-bold text-[12px] text-[#000080] mb-1">
                    {t('voucher.foundHeading', { number: pendingValidation.voucherNumber })}
                  </p>
                  <p>{pendingValidation.message}</p>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-2 pt-2 border-t border-[#808080]">
                <button
                  onClick={handleConfirmRedeem}
                  disabled={isRedeeming}
                  className="win-raised active:win-pressed px-3 py-1 bg-[#C0C0C0] text-black text-[11px] font-bold cursor-pointer min-w-[90px]"
                >
                  {isRedeeming ? t('voucher.redeeming') : t('voucher.confirmButton')}
                </button>
                <button
                  onClick={handleCancelConfirm}
                  disabled={isRedeeming}
                  className="win-raised active:win-pressed px-3 py-1 bg-[#C0C0C0] text-black text-[11px] cursor-pointer min-w-[70px]"
                >
                  {t('voucher.cancelButton')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL ESPECIAL DE CELEBRACIÓN (18 / 18) ================= */}
      {showCelebration && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-3 animate-fade-in">
          <div className="w-full max-w-[420px] bg-[#C0C0C0] win-raised p-1 shadow-2xl border border-[#a0a0a0] flex flex-col">
            {/* Barra de título de la celebración */}
            <div className="bg-[#000080] text-white px-2 py-0.5 flex items-center justify-between text-[11px] font-bold">
              <div className="flex items-center space-x-1.5 truncate">
                <span>🎉</span>
                <span>{t('voucher.celebrationTitle')}</span>
              </div>
              <button
                onClick={handleUseLater}
                className="win-raised w-4 h-4 flex items-center justify-center bg-[#C0C0C0] text-black text-[10px] font-bold leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Contenido exacto requerido */}
            <div className="p-4 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="text-4xl select-none animate-bounce">🎁</div>
                <div className="flex-1 text-[12px] text-black font-sans leading-relaxed">
                  <p className="font-bold text-[13px] text-[#5A0017] mb-1.5">
                    {t('voucher.celebrationExactMessage')}
                  </p>
                </div>
              </div>

              {/* Botones [Usarlo ahora] [Más tarde] */}
              <div className="flex justify-end gap-2 pt-2 border-t border-[#808080]">
                <button
                  onClick={handleUseNow}
                  className="win-raised active:win-pressed px-3.5 py-1.5 bg-[#C0C0C0] text-black text-[11px] font-bold cursor-pointer hover:bg-[#D4D0C8]"
                >
                  {t('voucher.useNowButton')}
                </button>
                <button
                  onClick={handleUseLater}
                  className="win-raised active:win-pressed px-3.5 py-1.5 bg-[#C0C0C0] text-black text-[11px] cursor-pointer"
                >
                  {t('voucher.useLaterButton')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
