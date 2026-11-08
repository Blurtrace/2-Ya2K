'use client';

import React from 'react';
import type { SmileyMood } from './types';

type SmileyButtonProps = {
  mood: SmileyMood;
  onClick: () => void;
};

export const SmileyButton = ({ mood, onClick }: SmileyButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Reiniciar juego"
      className="win-button w-[26px] h-[26px] flex items-center justify-center p-0 cursor-pointer active:win-pressed select-none"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-[18px] h-[18px]"
        style={{ shapeRendering: 'geometricPrecision' }}
      >
        {/* Yellow Face Background */}
        <circle cx="12" cy="12" r="10" fill="#FFFF00" stroke="#000000" strokeWidth="1" />

        {mood === 'idle' && (
          <>
            {/* Eyes */}
            <circle cx="8.5" cy="9.5" r="1.2" fill="#000000" />
            <circle cx="15.5" cy="9.5" r="1.2" fill="#000000" />
            {/* Smile */}
            <path
              d="M7.5 14.5 Q12 18 16.5 14.5"
              fill="none"
              stroke="#000000"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </>
        )}

        {mood === 'surprised' && (
          <>
            {/* Wide Eyes */}
            <circle cx="8.5" cy="9" r="1.5" fill="#000000" />
            <circle cx="15.5" cy="9" r="1.5" fill="#000000" />
            {/* Open Mouth 'O' */}
            <ellipse cx="12" cy="15.5" rx="2.5" ry="3.5" fill="#000000" />
          </>
        )}

        {mood === 'lost' && (
          <>
            {/* Dead Eye Left (X) */}
            <line x1="7" y1="8" x2="10" y2="11" stroke="#000000" strokeWidth="1.4" />
            <line x1="10" y1="8" x2="7" y2="11" stroke="#000000" strokeWidth="1.4" />
            {/* Dead Eye Right (X) */}
            <line x1="14" y1="8" x2="17" y2="11" stroke="#000000" strokeWidth="1.4" />
            <line x1="17" y1="8" x2="14" y2="11" stroke="#000000" strokeWidth="1.4" />
            {/* Frown */}
            <path
              d="M7.5 16.5 Q12 13 16.5 16.5"
              fill="none"
              stroke="#000000"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </>
        )}

        {mood === 'won' && (
          <>
            {/* Cool Sunglasses */}
            <path
              d="M5 8.5 L19 8.5 L18 12 Q15.5 13.5 13 12 L12 10.5 L11 12 Q8.5 13.5 6 12 Z"
              fill="#000000"
            />
            {/* Sunglasses white shine */}
            <line x1="7" y1="9.5" x2="10" y2="9.5" stroke="#FFFFFF" strokeWidth="0.8" />
            <line x1="14" y1="9.5" x2="17" y2="9.5" stroke="#FFFFFF" strokeWidth="0.8" />
            {/* Smug Cool Smile */}
            <path
              d="M8 15 Q12 18.5 16 15"
              fill="none"
              stroke="#000000"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </button>
  );
};
