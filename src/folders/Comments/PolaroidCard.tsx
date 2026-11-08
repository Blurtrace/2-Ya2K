'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { type MediaItem, getAlbumQuote, getAlbumLocation, getAlbumDisplayDate } from './albumData';
import { useT } from '@/i18n/I18nContext';

type PolaroidCardProps = {
  item: MediaItem;
  isFlipped: boolean;
  onFlipToggle: () => void;
  isAlreadyRevealed: boolean;
  onRevealed: (id: string) => void;
};

/**
 * Tarjeta Polaroid clásica con revelado químico progresivo y reverso estilo Bloc de notas de Windows 98.
 * Totalmente fiel al diseño estricto de Windows 98.
 */
export const PolaroidCard = ({
  item,
  isFlipped,
  onFlipToggle,
  isAlreadyRevealed,
  onRevealed,
}: PolaroidCardProps) => {
  const { lang, t } = useT();
  const [isDeveloping, setIsDeveloping] = useState(!isAlreadyRevealed && item.mediaType !== 'card');

  useEffect(() => {
    if (!isAlreadyRevealed && item.mediaType !== 'card') {
      setIsDeveloping(true);
      const timer = setTimeout(() => {
        setIsDeveloping(false);
        onRevealed(item.id);
      }, 2500); // 2.5 segundos de revelado químico instantáneo

      return () => clearTimeout(timer);
    } else {
      setIsDeveloping(false);
    }
  }, [item.id, isAlreadyRevealed, item.mediaType, onRevealed]);

  const displayDate = getAlbumDisplayDate(item, lang);
  const locationText = getAlbumLocation(item, lang);
  const quoteText = getAlbumQuote(item, lang);
  const senderName = item.sender === 'Familia' && lang === 'en' ? t('album.senderFamily') : item.sender;

  return (
    <div
      onClick={onFlipToggle}
      className="relative w-[310px] sm:w-[350px] md:w-[380px] h-[410px] sm:h-[450px] md:h-[480px] cursor-pointer select-none perspective-1000"
      title={t('album.flipMemoryTitle')}
    >
      {/* Contenedor con efecto 3D flip */}
      <div
        className={`w-full h-full transition-transform duration-500 ease-in-out transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ================= ANVERSO: FOTOGRAFÍA POLAROID ================= */}
        <div className="absolute inset-0 backface-hidden bg-white p-3 pb-6 flex flex-col justify-between shadow-[2px_2px_0px_#808080,inset_-1px_-1px_0px_#dfdfdf,inset_1px_1px_0px_#ffffff] border border-[#a0a0a0]">
          {/* Marco interior de la imagen (Pantalla negra -> Revelado) */}
          <div className="relative w-full flex-1 bg-black overflow-hidden border border-[#808080] flex items-center justify-center">
            {item.mediaType === 'card' ? (
              // Tarjeta especial de cumpleaños de Roselis
              <div className="w-full h-full bg-[#FFFFE0] p-4 flex flex-col items-center justify-center text-center text-black border-2 border-dashed border-[#B8860B]">
                <div className="text-3xl mb-2 animate-bounce">🎂</div>
                <span className="font-bold text-sm tracking-wide text-[#800000] uppercase mb-1">
                  {t('album.happyBirthday')}
                </span>
                <p className="text-xs text-[#333] font-serif italic mb-3">
                  {t('album.birthdayCardSub')}
                </p>
                <div className="text-[11px] bg-[#FFF8DC] border border-[#D2B48C] px-3 py-1 font-mono text-[#8B0000]">
                  {t('album.clickToOpen')}
                </div>
              </div>
            ) : item.mediaType === 'video' ? (
              <video
                src={item.src}
                autoPlay
                loop
                muted
                playsInline
                className={`w-full h-full object-cover transition-none ${
                  isDeveloping ? 'polaroid-developing' : ''
                }`}
              />
            ) : (
              <Image
                src={item.src}
                alt={locationText || 'Foto de recuerdo'}
                fill
                sizes="(max-width: 640px) 310px, (max-width: 768px) 350px, 380px"
                className={`object-contain transition-none ${
                  isDeveloping ? 'polaroid-developing' : ''
                }`}
                priority
              />
            )}

            {/* Indicador de revelado sutil en esquina inferior */}
            {isDeveloping && (
              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 font-mono">
                {t('album.developing')}
              </div>
            )}
          </div>

          {/* Faldón inferior de la Polaroid con placa de Windows 98 */}
          <div className="mt-3 pt-2 border-t border-[#e0e0e0] flex items-center justify-between text-[11px] text-black">
            {/* Placa retro con fecha y lugar (Tipografía Windows 98 Tahoma/Sans, NUNCA manuscrita) */}
            <div className="flex items-center space-x-1.5">
              <span className="bg-[#000080] text-white px-1.5 py-0.5 font-bold text-[10px] tracking-wide">
                {displayDate}
              </span>
              {locationText && (
                <span className="font-semibold text-neutral-800 truncate max-w-[170px] sm:max-w-[210px]">
                  {locationText}
                </span>
              )}
            </div>

            {/* Indicador de acción para voltear */}
            <div className="flex items-center space-x-1 text-[#666] text-[10px] group-hover:text-black">
              <span>🔄</span>
              <span className="hidden sm:inline">{t('album.flip')}</span>
            </div>
          </div>
        </div>

        {/* ================= REVERSO: BLOC DE NOTAS WINDOWS 98 ================= */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#C0C0C0] p-1 shadow-[2px_2px_0px_#808080] border border-[#a0a0a0] flex flex-col">
          {/* Barra de título del Bloc de notas */}
          <div className="bg-[#000080] text-white px-2 py-0.5 flex items-center justify-between text-[11px] font-bold">
            <div className="flex items-center space-x-1.5 truncate">
              <span className="text-[12px]">📝</span>
              <span className="truncate">{t('album.notepadTitle')}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFlipToggle();
              }}
              className="win-raised w-4 h-4 flex items-center justify-center bg-[#C0C0C0] text-black text-[10px] font-bold leading-none cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Barra de menú ficticia de Windows 98 */}
          <div className="flex space-x-3 px-2 py-0.5 text-[11px] text-black border-b border-[#808080]">
            <span className="hover:bg-[#000080] hover:text-white px-1 cursor-default">{t('explorer.file')}</span>
            <span className="hover:bg-[#000080] hover:text-white px-1 cursor-default">{t('explorer.edit')}</span>
            <span className="hover:bg-[#000080] hover:text-white px-1 cursor-default">{t('menu.format')}</span>
            <span className="hover:bg-[#000080] hover:text-white px-1 cursor-default">{t('explorer.help')}</span>
          </div>

          {/* Área de texto del Bloc de notas (Fondo blanco, tipografía Courier New) */}
          <div className="flex-1 bg-white p-3.5 m-0.5 win-sunken overflow-y-auto font-mono text-[12px] sm:text-[13px] text-black leading-relaxed whitespace-pre-wrap select-text">
            {/* Encabezado del remitente */}
            <div className="border-b border-dashed border-[#808080] pb-2 mb-3">
              <p className="font-bold text-[#000080]">
                {t('album.from', { sender: senderName.toUpperCase() })}
              </p>
              <p className="text-[10.5px] text-[#555]">
                {t('album.date', { date: `${displayDate}${locationText ? ` • ${locationText}` : ''}` })}
              </p>
            </div>

            {/* Contenido de la frase o dedicatoria */}
            {quoteText ? (
              <p className="italic text-[#111]">{quoteText}</p>
            ) : (
              <div className="flex flex-col items-center justify-center h-28 text-[#666] text-center">
                <span className="text-xl mb-1 text-red-600">♥</span>
                <p className="text-[11px] font-sans">
                  {t('album.emptyMemory')}
                </p>
              </div>
            )}

            {/* Firma al final */}
            <div className="mt-4 pt-2 border-t border-dashed border-[#808080] text-right text-[11px] text-[#444]">
              {t('album.withLove', { sender: senderName })}
            </div>
          </div>

          {/* Barra de estado inferior del Bloc de notas */}
          <div className="flex justify-between items-center px-2 py-0.5 text-[10px] text-[#333] border-t border-[#dfdfdf] bg-[#C0C0C0]">
            <span>{t('album.statusLn')}</span>
            <span>100%</span>
            <span>Windows (CRLF)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
