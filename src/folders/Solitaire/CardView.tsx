'use client';

import React from 'react';
import type { Card, CardBackTheme, Rank, Suit } from './types';

export const getSuitColor = (suit: Suit): 'red' | 'black' => {
  return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
};

export const getRankLabel = (rank: Rank): string => {
  switch (rank) {
    case 1:
      return 'A';
    case 11:
      return 'J';
    case 12:
      return 'Q';
    case 13:
      return 'K';
    default:
      return rank.toString();
  }
};

/** SVGs pixel-perfect de los 4 palos clásicos */
export const SuitIcon = ({ suit, className = 'w-3.5 h-3.5' }: { suit: Suit; className?: string }) => {
  switch (suit) {
    case 'hearts':
      return (
        <svg viewBox="0 0 24 24" fill="#D31111" className={className} aria-hidden="true">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );
    case 'diamonds':
      return (
        <svg viewBox="0 0 24 24" fill="#D31111" className={className} aria-hidden="true">
          <path d="M12 2L2 12l10 10 10-10L12 2z" />
        </svg>
      );
    case 'spades':
      return (
        <svg viewBox="0 0 24 24" fill="#111111" className={className} aria-hidden="true">
          <path d="M12 2C9.5 5.5 4 10.5 4 14.5a5 5 0 0 0 8 3.8v2.7h-3v1h6v-1h-3v-2.7a5 5 0 0 0 8-3.8c0-4-5.5-9-8-12.5z" />
        </svg>
      );
    case 'clubs':
      return (
        <svg viewBox="0 0 24 24" fill="#111111" className={className} aria-hidden="true">
          <path d="M12 2a4 4 0 0 0-3.5 6A5.5 5.5 0 0 0 3 13.5a5.5 5.5 0 0 0 6.5 5.4v2.1H7v1h10v-1h-2.5v-2.1a5.5 5.5 0 0 0 6.5-5.4A5.5 5.5 0 0 0 15.5 8 4 4 0 0 0 12 2z" />
        </svg>
      );
  }
};

/** Ilustración retro de figuras (J, Q, K) */
const CourtCardIllustration = ({ rank, suit }: { rank: Rank; suit: Suit }) => {
  const isRed = suit === 'hearts' || suit === 'diamonds';
  const accent = isRed ? '#D31111' : '#104E8B';

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-1 bg-[#FAFAF8] border border-[#DDD] rounded-[2px] overflow-hidden select-none">
      <div className="w-full flex items-center justify-between px-1">
        <span className="text-[10px] font-bold" style={{ color: accent }}>
          {getRankLabel(rank)}
        </span>
        <SuitIcon suit={suit} className="w-2.5 h-2.5" />
      </div>

      {/* Arte central clásico */}
      <div className="relative w-8 h-10 flex items-center justify-center my-auto">
        <svg viewBox="0 0 40 50" className="w-full h-full">
          <rect x="2" y="2" width="36" height="46" fill="#F4E8C1" stroke="#333" strokeWidth="1" />
          {rank === 13 ? (
            // Rey (King)
            <>
              {/* Corona dorada */}
              <polygon points="12,12 16,6 20,11 24,6 28,12 28,15 12,15" fill="#FFD700" stroke="#000" strokeWidth="0.8" />
              {/* Rostro y Barba */}
              <circle cx="20" cy="20" r="5" fill="#FFDBAC" />
              <path d="M16 22 Q20 28 24 22 Z" fill="#888" stroke="#333" strokeWidth="0.5" />
              {/* Manto real */}
              <rect x="10" y="26" width="20" height="18" fill={accent} stroke="#000" strokeWidth="0.8" />
              <line x1="20" y1="26" x2="20" y2="44" stroke="#FFD700" strokeWidth="2" />
            </>
          ) : rank === 12 ? (
            // Reina (Queen)
            <>
              {/* Tiara */}
              <polygon points="14,10 17,7 20,9 23,7 26,10 25,13 15,13" fill="#FFD700" stroke="#000" strokeWidth="0.8" />
              {/* Rostro y Cabello */}
              <circle cx="20" cy="18" r="4.5" fill="#FFE0BD" />
              <path d="M14 16 Q20 12 26 16" fill="none" stroke="#8B4513" strokeWidth="1.5" />
              {/* Manto y Collar */}
              <path d="M12 24 L28 24 L25 44 L15 44 Z" fill={accent} stroke="#000" strokeWidth="0.8" />
              <circle cx="20" cy="26" r="1.5" fill="#FFD700" />
            </>
          ) : (
            // Sota (Jack)
            <>
              {/* Casco / Gorro militar clásico */}
              <path d="M14 14 Q20 8 26 14 Z" fill="#2E8B57" stroke="#000" strokeWidth="0.8" />
              {/* Rostro */}
              <circle cx="20" cy="18" r="4.5" fill="#FFDBAC" />
              {/* Armadura */}
              <rect x="13" y="24" width="14" height="20" fill={accent} stroke="#000" strokeWidth="0.8" />
              <line x1="16" y1="24" x2="24" y2="44" stroke="#FFF" strokeWidth="1" strokeDasharray="2,2" />
            </>
          )}
        </svg>
      </div>

      <div className="w-full flex items-center justify-between px-1 rotate-180">
        <span className="text-[10px] font-bold" style={{ color: accent }}>
          {getRankLabel(rank)}
        </span>
        <SuitIcon suit={suit} className="w-2.5 h-2.5" />
      </div>
    </div>
  );
};

/** Reverso de carta de Windows 98 con los 5 temas retro */
export const CardBackView = ({ theme = 'geometric' }: { theme: CardBackTheme }) => {
  return (
    <div className="w-full h-full rounded-[3px] border border-[#000] p-[3px] bg-white overflow-hidden shadow-[1px_1px_0px_rgba(0,0,0,0.4)]">
      <div className="w-full h-full rounded-[2px] overflow-hidden relative">
        {theme === 'geometric' && (
          // Rejilla geométrica azul clásica de Windows 98
          <div
            className="w-full h-full bg-[#000080]"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #004080 0, #004080 2px, transparent 0, transparent 6px),
                                repeating-linear-gradient(-45deg, #004080 0, #004080 2px, #000080 0, #000080 6px)`,
              border: '2px solid #FFF',
            }}
          />
        )}

        {theme === 'beach' && (
          // Playa retro con puesta de sol y palmera
          <div className="w-full h-full bg-gradient-to-b from-[#FF7F50] via-[#FFA500] to-[#20B2AA] flex flex-col items-center justify-between p-1 border border-white">
            <svg viewBox="0 0 40 60" className="w-full h-full">
              {/* Sol */}
              <circle cx="28" cy="18" r="7" fill="#FFD700" />
              {/* Tronco de palmera */}
              <path d="M12 55 Q16 35 14 22" fill="none" stroke="#8B4513" strokeWidth="2.5" strokeLinecap="round" />
              {/* Hojas */}
              <path d="M14 22 Q8 16 2 20" fill="none" stroke="#228B22" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M14 22 Q16 12 24 16" fill="none" stroke="#228B22" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M14 22 Q12 10 10 6" fill="none" stroke="#228B22" strokeWidth="1.5" strokeLinecap="round" />
              {/* Mar */}
              <path d="M0 46 Q10 44 20 46 T40 46 L40 60 L0 60 Z" fill="#008080" />
            </svg>
          </div>
        )}

        {theme === 'castle' && (
          // Castillo tenebroso con luna llena y murciélagos
          <div className="w-full h-full bg-[#0B0D1B] flex flex-col items-center justify-center border border-white">
            <svg viewBox="0 0 40 60" className="w-full h-full">
              {/* Luna llena */}
              <circle cx="20" cy="18" r="9" fill="#FFF8DC" />
              {/* Murciélagos */}
              <path d="M6 12 Q9 9 12 12 Q9 14 6 12 Z" fill="#0B0D1B" />
              <path d="M26 8 Q29 6 32 8 Q29 10 26 8 Z" fill="#0B0D1B" />
              {/* Silueta de castillo */}
              <rect x="10" y="32" width="20" height="28" fill="#1C1F2E" />
              <polygon points="10,32 15,22 15,32" fill="#1C1F2E" />
              <polygon points="25,32 25,22 30,32" fill="#1C1F2E" />
              <polygon points="17,32 20,20 23,32" fill="#1C1F2E" />
              {/* Ventanitas iluminadas */}
              <rect x="18" y="36" width="4" height="6" rx="2" fill="#FFD700" />
            </svg>
          </div>
        )}

        {theme === 'robot' && (
          // Robot retro de cuerda
          <div className="w-full h-full bg-[#2F4F4F] flex flex-col items-center justify-center border border-white">
            <svg viewBox="0 0 40 60" className="w-full h-full">
              {/* Antena */}
              <line x1="20" y1="8" x2="20" y2="14" stroke="#C0C0C0" strokeWidth="1.5" />
              <circle cx="20" cy="8" r="2" fill="#FF0000" />
              {/* Cabeza cuadrada */}
              <rect x="11" y="14" width="18" height="14" fill="#A9A9A9" stroke="#000" strokeWidth="1" />
              <circle cx="15" cy="20" r="2" fill="#00FFFF" />
              <circle cx="25" cy="20" r="2" fill="#00FFFF" />
              <rect x="16" y="24" width="8" height="2" fill="#000" />
              {/* Cuerpo */}
              <rect x="9" y="30" width="22" height="24" fill="#708090" stroke="#000" strokeWidth="1" />
              {/* Indicador / Dial */}
              <circle cx="20" cy="40" r="6" fill="#F0E68C" stroke="#000" strokeWidth="0.8" />
              <line x1="20" y1="40" x2="23" y2="37" stroke="#FF0000" strokeWidth="1" />
            </svg>
          </div>
        )}

        {theme === 'roses' && (
          // Ramo clásico de rosas
          <div className="w-full h-full bg-[#004D20] flex flex-col items-center justify-center border border-white">
            <svg viewBox="0 0 40 60" className="w-full h-full">
              <circle cx="20" cy="24" r="8" fill="#C70039" />
              <circle cx="16" cy="22" r="5" fill="#FF5733" opacity="0.8" />
              <circle cx="24" cy="26" r="4" fill="#900C3F" />
              <path d="M20 32 Q22 46 16 56" fill="none" stroke="#2E7D32" strokeWidth="2.5" />
              <path d="M20 40 Q28 38 26 34" fill="none" stroke="#2E7D32" strokeWidth="2" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

type CardViewProps = {
  card: Card;
  cardBack?: CardBackTheme;
  isGhost?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Componente de Carta individual para el Solitario de Windows 98.
 */
export const CardView = ({
  card,
  cardBack = 'geometric',
  isGhost = false,
  className = '',
  style = {},
}: CardViewProps) => {
  if (!card.faceUp) {
    return (
      <div
        style={style}
        className={`w-[66px] h-[92px] select-none cursor-pointer flex-shrink-0 transition-shadow ${
          isGhost ? 'opacity-40' : ''
        } ${className}`}
      >
        <CardBackView theme={cardBack} />
      </div>
    );
  }

  const isRed = getSuitColor(card.suit) === 'red';
  const rankLabel = getRankLabel(card.rank);
  const isCourt = card.rank >= 11; // J, Q, K

  return (
    <div
      style={style}
      className={`w-[66px] h-[92px] rounded-[3px] border border-[#1a1a1a] bg-white p-[3px] flex flex-col justify-between shadow-[1px_1px_0px_rgba(0,0,0,0.5)] select-none cursor-pointer flex-shrink-0 ${
        isGhost ? 'opacity-50 ring-2 ring-yellow-400' : ''
      } ${className}`}
    >
      {isCourt ? (
        <CourtCardIllustration rank={card.rank} suit={card.suit} />
      ) : (
        <>
          {/* Esquina superior izquierda */}
          <div className="flex flex-col items-center w-4 leading-none">
            <span
              className={`text-[12px] font-bold tracking-tighter ${
                isRed ? 'text-[#D31111]' : 'text-black'
              }`}
            >
              {rankLabel}
            </span>
            <SuitIcon suit={card.suit} className="w-2.5 h-2.5 mt-0.5" />
          </div>

          {/* Iconos centrales */}
          <div className="flex-1 flex items-center justify-center">
            {card.rank === 1 ? (
              // As grande central
              <SuitIcon suit={card.suit} className="w-7 h-7" />
            ) : (
              // Número central repetido o estilizado
              <div className="flex flex-col items-center justify-center space-y-1">
                <SuitIcon suit={card.suit} className="w-4 h-4" />
                {card.rank > 3 && <SuitIcon suit={card.suit} className="w-3.5 h-3.5" />}
              </div>
            )}
          </div>

          {/* Esquina inferior derecha (invertida) */}
          <div className="flex flex-col items-center w-4 leading-none rotate-180 self-end">
            <span
              className={`text-[12px] font-bold tracking-tighter ${
                isRed ? 'text-[#D31111]' : 'text-black'
              }`}
            >
              {rankLabel}
            </span>
            <SuitIcon suit={card.suit} className="w-2.5 h-2.5 mt-0.5" />
          </div>
        </>
      )}
    </div>
  );
};
