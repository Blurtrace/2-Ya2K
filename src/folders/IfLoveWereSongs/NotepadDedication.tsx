'use client';

import React from 'react';
import { type Song, getSongDedication } from './songsData';
import { useT } from '@/i18n/I18nContext';

type NotepadDedicationProps = {
  song: Song | null;
};

export const NotepadDedication = ({ song }: NotepadDedicationProps) => {
  const { lang, t } = useT();

  const titleText = song
    ? t('songs.notepadTitle', { id: song.id })
    : t('songs.notepadDefaultTitle');

  const dedicationText = song ? getSongDedication(song, lang) : '';

  return (
    <div className="flex-1 flex flex-col bg-[#C0C0C0] win-raised p-[2px] min-w-0 h-full">
      {/* Barra de título de la mini-ventana Dedicatoria.txt */}
      <div className="flex items-center justify-between px-1.5 py-[2px] bg-[#000080] text-white text-[11px] font-bold select-none">
        <div className="flex items-center gap-1.5 truncate">
          <span>📝</span>
          <span className="truncate">{titleText}</span>
        </div>
        <div className="flex items-center gap-[2px]">
          <span className="win-raised bg-[#C0C0C0] text-black w-3.5 h-3.5 text-[9px] flex items-center justify-center font-bold">
            _
          </span>
          <span className="win-raised bg-[#C0C0C0] text-black w-3.5 h-3.5 text-[9px] flex items-center justify-center font-bold">
            ×
          </span>
        </div>
      </div>

      {/* Menú retro de bloc de notas */}
      <div className="flex items-center gap-2 px-1 py-[1px] text-[11px] text-black select-none border-b border-[#808080]">
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-default">{t('explorer.file')}</span>
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-default">{t('explorer.edit')}</span>
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-default">{t('menu.format')}</span>
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-default">{t('explorer.help')}</span>
      </div>

      {/* Área blanca de texto (Notepad clásico) */}
      <div className="flex-1 bg-white win-sunken p-2.5 overflow-y-auto text-black font-mono text-[12px] leading-relaxed flex flex-col justify-between select-text min-h-[140px]">
        {song ? (
          <div>
            <div className="border-b border-gray-300 pb-1 mb-2">
              <div className="text-[13px] font-bold font-sans text-[#000080] truncate">
                {song.title}
              </div>
              <div className="text-[11px] text-gray-700 font-sans truncate">{song.artist}</div>
            </div>

            <p className="whitespace-pre-wrap text-[12px] text-gray-900 font-mono">
              &quot;{dedicationText}&quot;
            </p>
          </div>
        ) : (
          <div className="text-gray-500 italic text-[11px] py-4 text-center">
            {t('songs.notepadPlaceholder')}
          </div>
        )}

        {song && (
          <div className="mt-3 pt-2 border-t border-dashed border-gray-300 flex items-center justify-between">
            <span className="text-[10px] text-gray-500 font-sans">
              {t('songs.trackOf', { track: song.trackNumber })}
            </span>
            <a
              href={song.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] active:win-pressed px-2 py-0.5 text-[11px] font-sans flex items-center gap-1.5 text-black no-underline"
              title={t('songs.openThisSpotify')}
            >
              <span className="text-green-600 font-bold">●</span>
              <span>{t('songs.openInSpotify')}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
