'use client';

import React, { useEffect, useRef } from 'react';
import type { Card, CardBackTheme } from './types';
import { getRankLabel, getSuitColor } from './CardView';

type VictoryCascadeProps = {
  foundations: Card[][];
  cardBack: CardBackTheme;
  onDismiss: () => void;
};

type BouncingCard = {
  card: Card;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

/**
 * La legendaria animación de victoria de Solitario de Windows 98 en Canvas.
 * Las cartas rebotan con gravedad dejando la mítica estela continua sobre el tapete verde.
 */
export const VictoryCascade = ({ foundations, onDismiss }: VictoryCascadeProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajustar dimensiones del canvas al contenedor
    canvas.width = canvas.parentElement?.clientWidth || 700;
    canvas.height = canvas.parentElement?.clientHeight || 500;

    const width = canvas.width;
    const height = canvas.height;
    const cardW = 66;
    const cardH = 92;

    // Recolectar todas las 52 cartas desde las 4 fundaciones (de K hacia A)
    const cardsToBounce: { card: Card; startX: number; startY: number }[] = [];
    const foundationOffsetLeft = width - (4 * (cardW + 12) + 16);
    const topY = 36;

    for (let r = 13; r >= 1; r--) {
      foundations.forEach((pile, fIdx) => {
        const c = pile.find((item) => item.rank === r);
        if (c) {
          const startX = foundationOffsetLeft + fIdx * (cardW + 12);
          cardsToBounce.push({
            card: c,
            startX: Math.max(16, startX),
            startY: topY,
          });
        }
      });
    }

    let currentCardIndex = 0;
    let activeCard: BouncingCard | null = null;
    let animId: number;

    const spawnNextCard = () => {
      if (currentCardIndex >= cardsToBounce.length) {
        // Todas las cartas han caído, podemos reiniciar el bucle para mantener el festejo
        currentCardIndex = 0;
      }
      const item = cardsToBounce[currentCardIndex];
      currentCardIndex++;

      // Velocidad horizontal variable hacia la izquierda o derecha
      const dir = Math.random() > 0.5 ? 1 : -1;
      const speedX = (Math.random() * 5 + 3) * dir;
      const speedY = -(Math.random() * 4 + 1);

      activeCard = {
        card: item.card,
        x: item.startX,
        y: item.startY,
        vx: speedX,
        vy: speedY,
      };
    };

    spawnNextCard();

    // Función auxiliar para dibujar una carta en el canvas 2D
    const drawCard = (x: number, y: number, card: Card) => {
      ctx.save();
      ctx.translate(x, y);

      // Fondo blanco y borde
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;

      // Rectángulo redondeado
      const r = 3;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(cardW - r, 0);
      ctx.quadraticCurveTo(cardW, 0, cardW, r);
      ctx.lineTo(cardW, cardH - r);
      ctx.quadraticCurveTo(cardW, cardH, cardW - r, cardH);
      ctx.lineTo(r, cardH);
      ctx.quadraticCurveTo(0, cardH, 0, cardH - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Sombra inferior derecha sutil
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(cardW - 1, 2, 1, cardH - 2);
      ctx.fillRect(2, cardH - 1, cardW - 2, 1);

      // Texto de rango y palo
      const isRed = getSuitColor(card.suit) === 'red';
      ctx.fillStyle = isRed ? '#D31111' : '#000000';
      ctx.font = 'bold 11px sans-serif';

      const rankStr = getRankLabel(card.rank);
      const suitSymbol =
        card.suit === 'hearts'
          ? '♥'
          : card.suit === 'diamonds'
          ? '♦'
          : card.suit === 'spades'
          ? '♠'
          : '♣';

      // Esquina superior izquierda
      ctx.fillText(rankStr, 4, 13);
      ctx.fillText(suitSymbol, 4, 25);

      // Símbolo central
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(suitSymbol, cardW / 2, cardH / 2);

      // Esquina inferior derecha
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(rankStr, cardW - 4, cardH - 3);

      ctx.restore();
    };

    const gravity = 0.55;
    const bounceDamping = 0.82;

    const render = () => {
      if (activeCard) {
        // Dibujamos la carta en su posición actual (SIN borrar el canvas para lograr la icónica estela)
        drawCard(activeCard.x, activeCard.y, activeCard.card);

        // Actualizar física
        activeCard.x += activeCard.vx;
        activeCard.vy += gravity;
        activeCard.y += activeCard.vy;

        // Rebote en el fondo de la mesa
        if (activeCard.y + cardH >= height) {
          activeCard.y = height - cardH;
          activeCard.vy = -activeCard.vy * bounceDamping;
        }

        // Si se sale de los bordes laterales o se detiene, lanzamos la siguiente carta
        if (activeCard.x + cardW < 0 || activeCard.x > width) {
          spawnNextCard();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [foundations]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onDismiss}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          onDismiss();
        }
      }}
      className="absolute inset-0 z-50 cursor-pointer select-none"
      title="¡Has ganado! Haz clic para volver a jugar"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-yellow-100 text-black px-4 py-1.5 border-2 border-black win-raised shadow-lg font-bold text-xs animate-bounce pointer-events-none">
        🏆 ¡VICTORIA! Haz clic en cualquier lugar para continuar
      </div>
    </div>
  );
};
