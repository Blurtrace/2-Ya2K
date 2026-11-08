'use client';

import React, { useState } from 'react';
import { useT } from '@/i18n/I18nContext';

type PasswordDialogProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

export const PasswordDialog = ({ onSuccess, onCancel }: PasswordDialogProps) => {
  const { t } = useT();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify-songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        onSuccess();
      } else {
        setError(data.error || t('songs.errorWrong'));
      }
    } catch {
      setError(t('songs.errorConnection'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[#C0C0C0] select-none min-h-[320px]">
      {/* Contenedor estilo cuadro de diálogo Windows 98 */}
      <div className="w-full max-w-[420px] bg-[#C0C0C0] win-raised p-3 flex flex-col gap-3">
        {/* Cabecera con icono retro de llave/seguridad */}
        <div className="flex items-start gap-3">
          <div className="text-3xl flex-shrink-0 select-none">🗝️</div>
          <div className="flex-1">
            <h3 className="font-bold text-[12px] text-black font-sans leading-tight">
              {t('songs.restrictedTitle')}
            </h3>
            <p className="text-[11px] text-gray-800 font-sans mt-1 leading-normal">
              {t('songs.restrictedDesc')}
            </p>
          </div>
        </div>

        {/* Formulario de entrada */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-1">
          <div className="flex flex-col gap-1">
            <label htmlFor="songs-password-input" className="text-[11px] text-black font-sans">
              {t('songs.password')}
            </label>
            <input
              id="songs-password-input"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="••••••••••••"
              disabled={isLoading}
              className="win-sunken bg-white px-2 py-1 text-[12px] font-mono text-black outline-none focus:bg-[#FFFFE1]"
            />
          </div>

          {/* Mensaje de error discreto */}
          {error && (
            <div className="text-[11px] text-red-700 bg-red-100 win-sunken px-2 py-1 flex items-center gap-1 font-sans">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Botón de pista */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowHint(true)}
              className="win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] active:win-pressed px-2 py-1 text-[11px] font-sans text-gray-800 flex items-center gap-1 cursor-pointer"
            >
              <span>💡</span>
              <span>{t('songs.showHint')}</span>
            </button>
          </div>

          {/* Botones Aceptar y Cancelar */}
          <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-[#808080]">
            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] active:win-pressed disabled:opacity-50 px-4 py-1 text-[11px] font-bold text-black min-w-[75px] cursor-pointer"
            >
              {isLoading ? t('songs.verifying') : t('dialog.ok')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] active:win-pressed px-4 py-1 text-[11px] text-black min-w-[75px] cursor-pointer"
            >
              {t('dialog.cancel')}
            </button>
          </div>
        </form>
      </div>

      {/* Cuadro de diálogo modal retro para la Pista */}
      {showHint && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3 select-none">
          <div className="w-full max-w-[360px] bg-[#C0C0C0] win-raised p-[3px] flex flex-col shadow-2xl animate-in fade-in duration-150">
            {/* Barra de título del modal de pista */}
            <div className="win-titlebar-active flex items-center justify-between px-2 py-1 text-white text-[11px] font-bold">
              <span className="flex items-center gap-1">
                <span>💡</span>
                <span>{t('songs.hintTitle')}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowHint(false)}
                className="win-raised bg-[#C0C0C0] text-black w-4 h-4 text-[10px] flex items-center justify-center font-bold"
              >
                ×
              </button>
            </div>

            {/* Contenido retro de la pista */}
            <div className="p-3 bg-[#C0C0C0] flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <span className="text-2xl flex-shrink-0">💬</span>
                <div className="text-[11px] font-sans text-gray-900 leading-relaxed whitespace-pre-line">
                  &quot;{t('songs.hintDialogBody')}&quot;
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-[#808080]">
                <button
                  type="button"
                  autoFocus
                  onClick={() => setShowHint(false)}
                  className="win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] active:win-pressed px-5 py-1 text-[11px] font-bold text-black min-w-[70px]"
                >
                  {t('songs.understood')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
