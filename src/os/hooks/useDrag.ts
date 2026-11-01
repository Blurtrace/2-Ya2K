import { useRef, useCallback } from 'react';

type DragOptions = {
  initialX: number;
  initialY: number;
  disabled?: boolean;
  onMove: (x: number, y: number) => void;
};

/**
 * Hook funcional para arrastre de ventanas mediante Pointer Events y setPointerCapture.
 * Compatible con ratón y pantallas táctiles, sin clases ni librerías externas.
 */
export const useDrag = ({ initialX, initialY, disabled = false, onMove }: DragOptions) => {
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ pointerX: 0, pointerY: 0, windowX: 0, windowY: 0 });

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (disabled || event.button !== 0) return; // Solo botón principal del ratón o toque

      const target = event.currentTarget;
      target.setPointerCapture(event.pointerId);
      isDraggingRef.current = true;

      startPosRef.current = {
        pointerX: event.clientX,
        pointerY: event.clientY,
        windowX: initialX,
        windowY: initialY,
      };
    },
    [disabled, initialX, initialY]
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!isDraggingRef.current || disabled) return;

      const deltaX = event.clientX - startPosRef.current.pointerX;
      const deltaY = event.clientY - startPosRef.current.pointerY;

      const nextX = Math.max(0, startPosRef.current.windowX + deltaX);
      const nextY = Math.max(0, startPosRef.current.windowY + deltaY);

      onMove(nextX, nextY);
    },
    [disabled, onMove]
  );

  const onPointerUp = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // Ignorar si el puntero ya no está capturado
    }
  }, []);

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
};

