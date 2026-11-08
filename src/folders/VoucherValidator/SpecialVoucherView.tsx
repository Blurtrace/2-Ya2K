'use client';

import React, { useState, useEffect } from 'react';
import { useT } from '@/i18n/I18nContext';
import {
  getLocalVoucherState,
  saveLocalVoucherState,
  type VoucherClientState,
} from './voucherStorage';
import { SpecialVoucherCard } from './SpecialVoucherCard';

export const SpecialVoucherView = () => {
  const { lang, t } = useT();
  const [state, setState] = useState<VoucherClientState>(getLocalVoucherState);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoadingPrize, setIsLoadingPrize] = useState(false);

  // Asegurar que tengamos los datos del premio
  useEffect(() => {
    const current = getLocalVoucherState();
    if (!current.prizeData && current.isSpecialUnlocked) {
      setIsLoadingPrize(true);
      fetch('/api/vouchers/prize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentRedeemed: current.redeemedVouchers }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.prize) {
            const updated = saveLocalVoucherState({ prizeData: data.prize });
            setState(updated);
          }
        })
        .finally(() => setIsLoadingPrize(false));
    }
  }, []);

  const handlePrizeRevealed = () => {
    const updated = saveLocalVoucherState({
      isPrizeRevealed: true,
      revealedAt: new Date().toISOString(),
    });
    setState(updated);
  };

  const handlePrint = () => {
    if (!state.isPrizeRevealed) return;
    window.print();
  };

  const prizeTitle =
    lang === 'en' && state.prizeData?.titleEn
      ? state.prizeData.titleEn
      : state.prizeData?.title || 'VIAJE A SAN ANDRÉS ISLAS';

  const prizeRedeemDate =
    lang === 'en' && state.prizeData?.redeemDateEn
      ? state.prizeData.redeemDateEn
      : state.prizeData?.redeemDate || 'Cupón redimible el 25 de noviembre de 2027.';

  return (
    <div className="flex-1 flex flex-col h-full bg-[#C0C0C0] text-black select-none font-sans overflow-hidden">
      {/* Estilos CSS específicos para la impresión en tamaño exacto 9 cm × 5,4 cm */}
      <style jsx global>{`
        @media print {
          /* Ocultar todo el sistema operativo, fondo y ventanas de ECOS 98 */
          body * {
            visibility: hidden !important;
          }
          /* Mostrar únicamente la tarjeta de voucher imprimible */
          #printable-voucher-card,
          #printable-voucher-card * {
            visibility: visible !important;
          }
          #printable-voucher-card {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 90mm !important;
            height: 54mm !important;
            max-width: 90mm !important;
            max-height: 54mm !important;
            margin: 0 !important;
            padding: 8px !important;
            box-shadow: none !important;
            border-radius: 6px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            page-break-inside: avoid !important;
          }
          @page {
            size: auto;
            margin: 10mm;
          }
        }
      `}</style>

      {/* Barra de herramientas superior Windows 98 */}
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-[#808080] bg-[#C0C0C0] text-[11px] gap-2 shadow-sm flex-wrap">
        <div className="flex items-center gap-1.5">
          {/* Botón de volteo 3D */}
          <button
            onClick={() => setIsFlipped((prev) => !prev)}
            className="win-raised active:win-pressed px-3 py-1 bg-[#C0C0C0] text-black text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            title={t('voucher.flipCardTitle')}
          >
            <span>🔄</span>
            <span>{isFlipped ? t('voucher.viewFront') : t('voucher.viewBack')}</span>
          </button>

          {/* Botón de impresión (habilitado únicamente tras revelar el premio) */}
          <button
            onClick={handlePrint}
            disabled={!state.isPrizeRevealed}
            className="win-raised active:win-pressed px-3 py-1 bg-[#C0C0C0] text-black text-[11px] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title={
              state.isPrizeRevealed
                ? t('voucher.printTitle')
                : t('voucher.printDisabledTooltip')
            }
          >
            <span>🖨</span>
            <span>{t('voucher.printButton')}</span>
          </button>
        </div>

        {/* Indicador de estado */}
        <div className="win-sunken bg-white px-2.5 py-0.5 text-[11px] font-mono flex items-center gap-1.5">
          <span className="text-[#5A0017] font-bold">
            {state.isPrizeRevealed
              ? `✨ ${t('voucher.prizeRevealedStatus')}`
              : `🪙 ${t('voucher.scratchPendingStatus')}`}
          </span>
        </div>
      </div>

      {/* Área central del visor con fondo suave para destacar el voucher burdeos */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-5 overflow-auto bg-[#808080]/20 win-sunken relative">
        {isLoadingPrize ? (
          <div className="flex items-center gap-2 win-sunken p-3 bg-white text-xs font-mono">
            <span className="animate-spin">⏳</span>
            <span>{t('voucher.loadingPrize')}</span>
          </div>
        ) : (
          <SpecialVoucherCard
            isFlipped={isFlipped}
            onFlipToggle={() => setIsFlipped((prev) => !prev)}
            isPrizeRevealed={state.isPrizeRevealed}
            onPrizeRevealed={handlePrizeRevealed}
            prizeTitle={prizeTitle}
            prizeRedeemDate={prizeRedeemDate}
          />
        )}
      </div>

      {/* Pie de instrucciones retro */}
      <div className="border-t border-[#808080] bg-[#C0C0C0] px-3 py-1.5 flex justify-between items-center text-[10.5px] text-neutral-800">
        <span className="truncate">
          {!state.isPrizeRevealed
            ? t('voucher.scratchInstructionFooter')
            : t('voucher.revealedInstructionFooter')}
        </span>
        <span className="font-mono text-[10px] text-neutral-600 whitespace-nowrap ml-2">
          9 cm × 5,4 cm
        </span>
      </div>
    </div>
  );
};
