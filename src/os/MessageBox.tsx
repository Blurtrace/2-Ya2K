'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import type { ModalState } from './state/types';
import { useOs } from './state/OsContext';
import { useT } from '@/i18n/I18nContext';

type MessageBoxProps = {
  modal: ModalState;
};

/**
 * Diálogo modal clásico de Windows 98.
 * Sin botones de minimizar o maximizar, con icono informativo/advertencia y botones biselados.
 */
export const MessageBox = ({ modal }: MessageBoxProps) => {
  const { dispatch } = useOs();
  const { t } = useT();

  const handleClose = () => {
    dispatch({ type: 'CLOSE_MODAL' });
  };

  const handleConfirm = () => {
    if (modal.onConfirm) {
      modal.onConfirm();
    }
    handleClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'Enter') {
        handleConfirm();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modal]);

  // Selección del icono del diálogo
  const iconSrc =
    modal.icon ??
    (modal.type === 'warning'
      ? '/icons/msg-warning.png'
      : modal.type === 'error'
      ? '/icons/msg-warning.png'
      : '/icons/msg-info.png');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t(modal.titleKey)}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/10 select-none"
    >
      <div className="win-raised bg-[#C0C0C0] p-[3px] w-full max-w-[360px] shadow-none">
        {/* Barra de título modal */}
        <div className="win-titlebar-active flex items-center justify-between px-1.5 py-0.5">
          <span className="text-[11px] font-bold truncate">
            {t(modal.titleKey)}
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="win-button w-4 h-[14px] p-0 font-bold text-[9px] flex items-center justify-center"
            aria-label={t('dialog.close')}
          >
            ✕
          </button>
        </div>

        {/* Cuerpo del mensaje */}
        <div className="p-4 flex items-start space-x-3.5">
          <div className="flex-shrink-0 mt-0.5">
            <Image
              src={iconSrc}
              alt=""
              width={32}
              height={32}
              className="pixelated"
            />
          </div>
          <div className="text-[11px] text-black leading-relaxed flex-1">
            {t(modal.messageKey)}
          </div>
        </div>

        {/* Botones de acción inferiores */}
        <div className="flex justify-center items-center space-x-2 pb-3 px-4">
          <button
            type="button"
            onClick={handleConfirm}
            className="win-button win-button-default min-w-[75px] py-1 font-bold"
          >
            {t('dialog.ok')}
          </button>
          {modal.onConfirm && (
            <button
              type="button"
              onClick={handleClose}
              className="win-button min-w-[75px] py-1"
            >
              {t('dialog.cancel')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

