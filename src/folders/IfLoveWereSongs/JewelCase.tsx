'use client';

import React from 'react';
import Image from 'next/image';
import type { Song } from './songsData';

type JewelCaseProps = {
  song?: Song | null;
  isSpinning?: boolean;
  size?: 'normal' | 'mini';
  isLocked?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
};

export const JewelCase = ({
  song,
  isSpinning = false,
  size = 'normal',
  isLocked = false,
  onClick,
  isSelected = false,
}: JewelCaseProps) => {
  const isMini = size === 'mini';
  const containerDim = isMini ? 'w-[72px] h-[72px]' : 'w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]';

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`relative ${containerDim} flex-shrink-0 cursor-pointer select-none transition-transform active:scale-[0.98] ${
        isSelected ? 'ring-2 ring-[#000080] outline outline-1 outline-white' : ''
      }`}
    >
      {/* Marco de caja de CD acrílica transparente retro (Jewel Case) */}
      <div className="absolute inset-0 bg-[#D4D0C8] win-raised flex p-[3px] shadow-md overflow-hidden">
        {/* Lomo estriado izquierdo de plástico negro */}
        <div
          className={`${
            isMini ? 'w-[5px]' : 'w-[10px]'
          } h-full bg-[#1A1A1A] mr-[2px] flex flex-col justify-between py-1 border-r border-[#404040]`}
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, #1A1A1A, #1A1A1A 2px, #333333 2px, #333333 4px)',
          }}
        />

        {/* Interior del estuche: disco o portada */}
        <div className="relative flex-1 h-full bg-black win-sunken overflow-hidden flex items-center justify-center">
          {isLocked ? (
            // Caja bloqueada con candado retro
            <div className="flex flex-col items-center justify-center text-center p-1 w-full h-full bg-[#202020]">
              <span className={isMini ? 'text-lg' : 'text-3xl'}>🔒</span>
              {!isMini && (
                <span className="text-[10px] text-gray-400 font-mono mt-1">Por descubrir</span>
              )}
            </div>
          ) : song ? (
            <>
              {/* Portada oficial */}
              <div
                className={`relative w-full h-full transition-transform duration-700 ${
                  isSpinning ? 'animate-spin' : ''
                }`}
              >
                <Image
                  src={song.coverUrl}
                  alt={`${song.title} - ${song.artist}`}
                  fill
                  className="object-cover"
                  sizes={isMini ? '72px' : '200px'}
                  priority={!isMini}
                />
              </div>

              {/* Reflejo plástico diagonal retro de la caja de joya */}
              <div
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 40%, transparent 60%, rgba(255,255,255,0.2) 100%)',
                }}
              />
            </>
          ) : (
            // Estado vacío inicial
            <div className="flex flex-col items-center justify-center text-center p-2 text-gray-400">
              <span className="text-3xl animate-pulse">💿</span>
              <span className="text-[11px] font-mono mt-1 text-center">Pulsa Descubrir</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
