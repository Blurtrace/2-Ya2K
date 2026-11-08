'use client';

import React, { useRef } from 'react';
import { JewelCase } from './JewelCase';
import { SONGS_DATA, Song } from './songsData';

type ShelfCarouselProps = {
  discoveredIds: string[];
  selectedSongId: string | null;
  onSelectSong: (song: Song) => void;
};

export const ShelfCarousel = ({
  discoveredIds,
  selectedSongId,
  onSelectSong,
}: ShelfCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const offset = direction === 'left' ? -220 : 220;
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const discoveredCount = discoveredIds.length;
  const totalCount = SONGS_DATA.length;

  return (
    <div className="flex flex-col bg-[#C0C0C0] win-sunken p-1.5 mt-2 select-none">
      {/* Cabecera del estante */}
      <div className="flex items-center justify-between pb-1 px-1 text-[11px] font-bold text-gray-800">
        <span className="flex items-center gap-1">
          <span>💿</span>
          <span>Estante de Canciones ({discoveredCount} de {totalCount} descubiertas)</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] active:win-pressed px-2 py-0.5 text-[10px] font-bold"
            title="Desplazar a la izquierda"
          >
            ◀
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="win-raised bg-[#C0C0C0] hover:bg-[#D4D0C8] active:win-pressed px-2 py-0.5 text-[10px] font-bold"
            title="Desplazar a la derecha"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Contenedor desplazable de carátulas */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 scrollbar-thin scrollbar-thumb-gray-400"
        style={{ scrollbarWidth: 'thin' }}
      >
        {SONGS_DATA.map((song) => {
          const isDiscovered = discoveredIds.includes(song.id);
          const isSelected = selectedSongId === song.id;

          return (
            <div key={song.id} className="flex flex-col items-center flex-shrink-0">
              <JewelCase
                song={isDiscovered ? song : undefined}
                size="mini"
                isLocked={!isDiscovered}
                isSelected={isSelected}
                onClick={isDiscovered ? () => onSelectSong(song) : undefined}
              />
              <span className="text-[10px] font-mono text-gray-700 mt-1 truncate max-w-[72px] text-center">
                {isDiscovered ? song.title : `Pista ${song.trackNumber}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
