'use client';

import React from 'react';

export type CharacterType = 'tata' | 'cooky';
export type PoseIndex = 0 | 1 | 2 | 3;

type GuideCharacterProps = {
  character: CharacterType;
  pose: PoseIndex;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

/**
 * Componente puro que renderiza el sprite animado/estático de TATA o COOKY
 * según la pose (0 = En espera, 1 = Saludando, 2 = Explicando, 3 = Dando una pista).
 * Utiliza CSS Sprites pixelated de alta fidelidad directamente desde los PNG RGBA.
 */
export const GuideCharacter = ({
  character,
  pose,
  size = 'md',
  className = '',
}: GuideCharacterProps) => {
  // Proporción original de sprite: 543 × 724 px (ratio aprox 3:4)
  const dimensions = {
    sm: { width: 54, height: 72 },
    md: { width: 78, height: 104 },
    lg: { width: 105, height: 140 },
  }[size];

  // Las 4 columnas se alinean exactamente con bg-position porcentaje:
  // Pose 0: 0% | Pose 1: 33.333% | Pose 2: 66.667% | Pose 3: 100%
  const bgX = (pose * 100) / 3;

  return (
    <div
      role="img"
      aria-label={`${character.toUpperCase()} pose ${pose + 1}`}
      className={`relative select-none pointer-events-none ${className}`}
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        backgroundImage: `url(/guides/${character}-poses.png)`,
        backgroundSize: '400% 100%',
        backgroundPosition: `${bgX}% 0%`,
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
      }}
    />
  );
};
