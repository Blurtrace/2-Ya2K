'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useT } from '@/i18n/I18nContext';

type SpecialVoucherCardProps = {
  isFlipped: boolean;
  onFlipToggle: () => void;
  isPrizeRevealed: boolean;
  onPrizeRevealed: () => void;
  prizeTitle: string;
  prizeRedeemDate: string;
};

/**
 * Tarjeta del Voucher Especial interactiva.
 * Reproduce fielmente el diseño de dos caras vino/burdeos con bordes festoneados,
 * reverso con ilustración vectorial de regalos/corazones, y frontal con zona de rascar por Canvas.
 */
export const SpecialVoucherCard = ({
  isFlipped,
  isPrizeRevealed,
  onPrizeRevealed,
  prizeTitle,
  prizeRedeemDate,
}: SpecialVoucherCardProps) => {
  const { t } = useT();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const isCompletedRef = useRef(isPrizeRevealed);

  // Inicializar el canvas de rascar con acabado metalizado plateado
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isPrizeRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    if (width === 0 || height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Gradiente metálico plateado realista
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#D6D6D6');
    grad.addColorStop(0.25, '#F0F0F0');
    grad.addColorStop(0.5, '#C0C0C0');
    grad.addColorStop(0.75, '#E8E8E8');
    grad.addColorStop(1, '#A8A8A8');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Textura retro sutil con puntos
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let x = 4; x < width; x += 8) {
      for (let y = 4; y < height; y += 8) {
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }

    // Texto de invitación a rascar
    ctx.fillStyle = '#5A0017';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(t('voucher.scratchPrompt'), width / 2, height / 2);
  }, [isPrizeRevealed, t]);

  useEffect(() => {
    isCompletedRef.current = isPrizeRevealed;
    if (!isPrizeRevealed) {
      initCanvas();
    }
  }, [isPrizeRevealed, initCanvas]);

  // Redimensionar si cambia el tamaño del visor
  useEffect(() => {
    const handleResize = () => {
      if (!isPrizeRevealed && !isCompletedRef.current) {
        initCanvas();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas, isPrizeRevealed]);

  // Verificar porcentaje de superficie rascada
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isCompletedRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let transparentPixels = 0;
      const totalPixels = data.length / 4;

      // Muestrear cada 4 píxeles para excelente rendimiento
      for (let i = 3; i < data.length; i += 16) {
        if (data[i] === 0) {
          transparentPixels += 4;
        }
      }

      const percent = (transparentPixels / totalPixels) * 100;
      if (percent >= 42) {
        isCompletedRef.current = true;
        setIsFadingOut(true);
        setTimeout(() => {
          onPrizeRevealed();
        }, 400);
      }
    } catch {
      // Ignorar si falla lectura por canvas
    }
  }, [onPrizeRevealed]);

  // Acción de rascar en el canvas
  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isCompletedRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isCompletedRef.current) return;
    setIsScratching(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratching || isCompletedRef.current) return;
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    if (!isScratching) return;
    setIsScratching(false);
    checkScratchPercentage();
  };

  return (
    <div className="relative w-full max-w-[480px] sm:max-w-[510px] aspect-[5/3] perspective-1000 select-none">
      {/* Contenedor 3D de volteo */}
      <div
        className={`w-full h-full transition-transform duration-500 ease-in-out transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* ============================================================== */}
        {/* CARA FRONTAL (VOUCHER CON ZONA DE RASCAR)                     */}
        {/* ============================================================== */}
        <div
          id="printable-voucher-card"
          className="absolute inset-0 backface-hidden rounded-xl bg-[#560014] p-2.5 sm:p-3 shadow-xl border border-white/80 flex flex-col justify-center items-center overflow-hidden"
        >
          {/* Borde exterior blanco fino característico */}
          <div className="w-full h-full border border-white/60 rounded-lg p-1.5 flex flex-col items-center justify-center relative">
            {/* Contenedor interior crema con festones laterales */}
            <div className="w-full h-full bg-[#FAF4E6] rounded-md flex flex-col items-center justify-between py-2.5 px-3 sm:px-6 relative overflow-hidden shadow-inner">
              {/* Festones laterales semicirculares (notches clásicos de ticket) */}
              <div className="absolute left-0 top-0 bottom-0 w-3 flex flex-col justify-around py-1 pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 bg-[#560014] rounded-r-full -ml-1 border-r border-black/20"
                  />
                ))}
              </div>

              <div className="absolute right-0 top-0 bottom-0 w-3 flex flex-col justify-around py-1 pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 bg-[#560014] rounded-l-full -mr-1 border-l border-black/20"
                  />
                ))}
              </div>

              {/* Título VOUCHER frontal */}
              <div className="text-center mt-0.5">
                <h1 className="text-[#560014] font-black text-2xl sm:text-3xl tracking-[0.2em] uppercase leading-none font-sans drop-shadow-sm">
                  VOUCHER
                </h1>
                {/* Subtítulo con flechas */}
                <div className="flex items-center justify-center gap-1.5 text-[#560014] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mt-1">
                  <span>➔</span>
                  <span>{t('voucher.redeemableFor')}</span>
                  <span>🠔</span>
                </div>
              </div>

              {/* Zona rectangular para rascar / Premio revelado */}
              <div className="relative w-full max-w-[340px] sm:max-w-[370px] h-[72px] sm:h-[84px] rounded-lg border-2 border-[#560014] bg-[#FFFDF8] overflow-hidden flex flex-col items-center justify-center p-2 text-center shadow-sm">
                {/* Contenido del premio bajo la capa de rascar */}
                <div className="flex flex-col items-center justify-center select-text">
                  <span className="text-[14px] sm:text-[16px] font-black text-[#560014] tracking-wide leading-tight uppercase font-sans">
                    {prizeTitle}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#222222] font-bold mt-1 leading-tight">
                    {prizeRedeemDate}
                  </span>
                </div>

                {/* Capa de rascar interactiva sobre el premio */}
                {!isPrizeRevealed && (
                  <canvas
                    ref={canvasRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    className={`absolute inset-0 w-full h-full cursor-pointer touch-none transition-opacity duration-300 ${
                      isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                  />
                )}
              </div>

              {/* Leyenda inferior SCRATCH HERE */}
              <div className="text-center mb-0.5">
                <span className="text-[#560014] font-black tracking-[0.25em] text-[10px] sm:text-[11px] uppercase">
                  SCRATCH HERE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CARA POSTERIOR (VOUCHER CON ILUSTRACIÓN DE REGALO Y CORAZONES) */}
        {/* ============================================================== */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl bg-[#560014] p-2.5 sm:p-3 shadow-xl border border-white/80 flex flex-col justify-center items-center overflow-hidden">
          {/* Marco decorativo festoneado blanco */}
          <div className="w-full h-full border border-white/80 rounded-lg p-2 flex flex-col items-center justify-between relative">
            {/* Título VOUCHER blanco */}
            <h1 className="text-white font-black text-2xl sm:text-3xl tracking-[0.2em] uppercase leading-none font-sans drop-shadow mt-1">
              VOUCHER
            </h1>

            {/* Ilustración vectorial en líneas blancas de la caja de regalos y corazones */}
            <div className="flex-1 w-full max-w-[280px] flex items-center justify-center py-1">
              <svg
                viewBox="0 0 200 120"
                className="w-full h-full text-white stroke-current fill-none stroke-[2] stroke-linecap-round stroke-linejoin-round"
              >
                {/* Caja de regalo: base */}
                <rect x="55" y="55" width="90" height="50" rx="2" />
                {/* Rayas verticales en la base de la caja */}
                <line x1="68" y1="55" x2="68" y2="105" />
                <line x1="80" y1="55" x2="80" y2="105" />
                <line x1="120" y1="55" x2="120" y2="105" />
                <line x1="132" y1="55" x2="132" y2="105" />

                {/* Tapa de la caja */}
                <rect x="50" y="45" width="100" height="12" rx="2" />

                {/* Cinta central vertical */}
                <rect x="92" y="45" width="16" height="60" fill="#560014" />
                <rect x="92" y="45" width="16" height="60" />

                {/* Etiqueta de regalo colgante */}
                <polygon points="120,70 135,76 130,90 115,84" />
                <circle cx="120" cy="74" r="1.5" />

                {/* Lazo superior */}
                {/* Bucle izquierdo */}
                <path d="M 100 45 C 80 20, 65 30, 95 45 Z" />
                {/* Bucle derecho */}
                <path d="M 100 45 C 120 20, 135 30, 105 45 Z" />
                {/* Nudo central */}
                <circle cx="100" cy="45" r="4" fill="#560014" />
                <circle cx="100" cy="45" r="4" />
                {/* Cintas que caen */}
                <path d="M 98 47 Q 88 56 86 65" />
                <path d="M 102 47 Q 112 56 114 65" />

                {/* Corazones flotantes alrededor */}
                {/* Corazón arriba izquierda */}
                <path
                  d="M 35 30 A 4 4 0 0 0 31 37 L 35 42 L 39 37 A 4 4 0 0 0 35 30 Z"
                  fill="white"
                />
                {/* Corazón centro izquierda */}
                <path
                  d="M 45 55 A 5 5 0 0 0 40 64 L 45 70 L 50 64 A 5 5 0 0 0 45 55 Z"
                  fill="white"
                />
                {/* Corazón abajo izquierda */}
                <path
                  d="M 32 80 A 4 4 0 0 0 28 87 L 32 92 L 36 87 A 4 4 0 0 0 32 80 Z"
                  fill="white"
                />

                {/* Corazón arriba derecha */}
                <path
                  d="M 165 30 A 5 5 0 0 0 160 39 L 165 45 L 170 39 A 5 5 0 0 0 165 30 Z"
                  fill="white"
                />
                {/* Corazón centro derecha */}
                <path
                  d="M 155 58 A 4 4 0 0 0 151 65 L 155 70 L 159 65 A 4 4 0 0 0 155 58 Z"
                  fill="white"
                />
                {/* Corazón abajo derecha */}
                <path
                  d="M 170 80 A 4 4 0 0 0 166 87 L 170 92 L 174 87 A 4 4 0 0 0 170 80 Z"
                  fill="white"
                />
              </svg>
            </div>

            {/* Borde festoneado interior blanco */}
            <div className="text-[10px] text-white/70 tracking-widest uppercase mb-1 font-mono">
              ★ EDICIÓN ESPECIAL ECOS 98 ★
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
