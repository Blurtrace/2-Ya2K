'use client';

import React, { useEffect, useState } from 'react';

type VisualizerProps = {
  isPlaying: boolean;
};

const BARS_COUNT = 14;
const SEGMENTS_COUNT = 8; // 2 rojos, 2 amarillos, 4 verdes

export const VisualizerBars = ({ isPlaying }: VisualizerProps) => {
  const [levels, setLevels] = useState<number[]>(() =>
    Array.from({ length: BARS_COUNT }, () => 1)
  );

  useEffect(() => {
    if (!isPlaying) {
      setLevels(Array.from({ length: BARS_COUNT }, () => 1));
      return;
    }

    const interval = setInterval(() => {
      setLevels(
        Array.from({ length: BARS_COUNT }, (_, i) => {
          // Genera alturas oscilantes con picos dinámicos
          const base = Math.sin(Date.now() / 200 + i * 0.8);
          const rand = Math.random() * 4;
          const val = Math.floor(Math.abs(base) * 4 + rand);
          return Math.min(SEGMENTS_COUNT, Math.max(1, val));
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div
      className="flex items-end justify-between bg-black p-1.5 win-sunken gap-[2px] w-[110px] h-[48px] select-none"
      title="Visualizador de Espectro Retro"
    >
      {levels.map((level, barIndex) => (
        <div key={barIndex} className="flex-1 flex flex-col justify-end gap-[1px] h-full">
          {Array.from({ length: SEGMENTS_COUNT }, (_, segIndex) => {
            const segFromBottom = segIndex + 1;
            const isLit = segFromBottom <= level;

            // Colores retro según la altura:
            // 8, 7: Rojo
            // 6, 5: Amarillo
            // 4, 3, 2, 1: Verde fósforo
            let litColor = '#00FF00';
            if (segFromBottom >= 7) litColor = '#FF3333';
            else if (segFromBottom >= 5) litColor = '#FFFF33';

            const unlitColor = '#152515';

            return (
              <div
                key={segIndex}
                className="w-full h-[3px]"
                style={{
                  backgroundColor: isLit ? litColor : unlitColor,
                  boxShadow: isLit ? `0 0 2px ${litColor}` : 'none',
                }}
              />
            );
          }).reverse()}
        </div>
      ))}
    </div>
  );
};
