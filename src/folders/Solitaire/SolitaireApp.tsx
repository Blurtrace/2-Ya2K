'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Card, CardBackTheme, DrawMode, HistorySnapshot } from './types';
import {
  dealInitialGame,
  canPlaceOnFoundation,
  canPlaceOnTableau,
  findLegalFoundation,
  findLegalTableau,
  canAutoComplete,
  cloneSnapshot,
} from './engine';
import { CardView, CardBackView } from './CardView';
import { CardBackDialog } from './CardBackDialog';
import { VictoryCascade } from './VictoryCascade';
import {
  playCardFlip,
  playCardPlace,
  playFoundation,
  playStockDeal,
  playVictoryFanfare,
} from './sounds';
import { useOs } from '@/os/state/OsContext';

type DraggingState = {
  cards: Card[];
  from:
    | { type: 'waste' }
    | { type: 'foundation'; index: number }
    | { type: 'tableau'; colIndex: number; cardIndex: number };
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  offsetX: number;
  offsetY: number;
};

export const SolitaireApp = () => {
  const { dispatch } = useOs();

  // Estado del juego
  const [stock, setStock] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
  const [tableau, setTableau] = useState<Card[][]>([[], [], [], [], [], [], []]);

  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // Opciones
  const [drawMode, setDrawMode] = useState<DrawMode>(1);
  const [cardBack, setCardBack] = useState<CardBackTheme>('geometric');
  const [showBackDialog, setShowBackDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  // Menús desplegables
  const [openMenu, setOpenMenu] = useState<'juego' | 'opciones' | 'ayuda' | null>(null);

  // Historial de Deshacer (Undo)
  const [history, setHistory] = useState<HistorySnapshot[]>([]);

  // Drag & drop
  const [dragging, setDragging] = useState<DraggingState | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Iniciar juego nuevo
  const startNewGame = useCallback(() => {
    const initial = dealInitialGame();
    setStock(initial.stock);
    setWaste(initial.waste);
    setFoundations(initial.foundations);
    setTableau(initial.tableau);
    setScore(0);
    setMoves(0);
    setTimerSeconds(0);
    setTimerActive(false);
    setIsWon(false);
    setHistory([]);
    setDragging(null);
    playStockDeal();
  }, []);

  // Inicialización al montar
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Cronómetro de juego
  useEffect(() => {
    if (!timerActive || isWon) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, isWon]);

  // Guardar snapshot para Deshacer
  const saveSnapshot = useCallback(() => {
    setHistory((prev) => [
      ...prev.slice(-30),
      cloneSnapshot(stock, waste, foundations, tableau, score),
    ]);
    if (!timerActive) setTimerActive(true);
  }, [stock, waste, foundations, tableau, score, timerActive]);

  // Deshacer movimiento
  const handleUndo = useCallback(() => {
    if (history.length === 0 || isWon) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));

    setStock(previous.stock);
    setWaste(previous.waste);
    setFoundations(previous.foundations);
    setTableau(previous.tableau);
    setScore(Math.max(0, previous.score - 2));
    setMoves((m) => m + 1);
    playCardFlip();
  }, [history, isWon]);

  // Verificar si se ha ganado
  useEffect(() => {
    const totalInFoundations = foundations.reduce((acc, f) => acc + f.length, 0);
    if (totalInFoundations === 52 && !isWon) {
      setIsWon(true);
      setTimerActive(false);
      // Puntuación bonus por tiempo
      const timeBonus = Math.max(0, 1000 - timerSeconds * 2);
      setScore((s) => s + 500 + timeBonus);
      playVictoryFanfare();
    }
  }, [foundations, isWon, timerSeconds]);

  // Clic en el mazo de robo (Stock)
  const handleStockClick = () => {
    if (isWon) return;
    saveSnapshot();

    if (stock.length > 0) {
      const count = Math.min(drawMode, stock.length);
      const drawnCards = stock.slice(stock.length - count).map((c) => ({
        ...c,
        faceUp: true,
      }));
      const remainingStock = stock.slice(0, stock.length - count);

      setStock(remainingStock);
      setWaste((prev) => [...prev, ...drawnCards]);
      setMoves((m) => m + 1);
      playCardFlip();
    } else if (waste.length > 0) {
      // Reciclar descarte al mazo
      const recycled = [...waste].reverse().map((c) => ({ ...c, faceUp: false }));
      setStock(recycled);
      setWaste([]);
      setScore((s) => Math.max(0, s - 20)); // Penalización estándar
      setMoves((m) => m + 1);
      playStockDeal();
    }
  };

  // Movimiento inteligente con un solo clic/tap
  const handleSmartCardClick = (
    card: Card,
    from:
      | { type: 'waste' }
      | { type: 'tableau'; colIndex: number; cardIndex: number }
      | { type: 'foundation'; index: number }
  ) => {
    if (isWon || !card.faceUp) return;

    // 1. Intentar enviar a Fundación
    if (from.type === 'waste' || (from.type === 'tableau' && from.cardIndex === tableau[from.colIndex].length - 1)) {
      const fIdx = findLegalFoundation(card, foundations);
      if (fIdx !== -1) {
        saveSnapshot();
        // Mover a fundación
        const nextFoundations = foundations.map((pile, idx) =>
          idx === fIdx ? [...pile, card] : pile
        );
        setFoundations(nextFoundations);

        if (from.type === 'waste') {
          setWaste((prev) => prev.slice(0, -1));
          setScore((s) => s + 10);
        } else if (from.type === 'tableau') {
          const nextTableau = tableau.map((col, idx) => {
            if (idx !== from.colIndex) return col;
            const updated = col.slice(0, -1);
            if (updated.length > 0) {
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                faceUp: true,
              };
            }
            return updated;
          });
          setTableau(nextTableau);
          setScore((s) => s + 10);
        }

        setMoves((m) => m + 1);
        playFoundation();
        return;
      }
    }

    // 2. Intentar mover a otra columna del tablero
    const targetColIdx = findLegalTableau(
      card,
      tableau,
      from.type === 'tableau' ? from.colIndex : undefined
    );

    if (targetColIdx !== -1) {
      saveSnapshot();

      if (from.type === 'waste') {
        setWaste((prev) => prev.slice(0, -1));
        setTableau((prev) =>
          prev.map((col, idx) => (idx === targetColIdx ? [...col, card] : col))
        );
        setScore((s) => s + 5);
      } else if (from.type === 'tableau') {
        const cardsToMove = tableau[from.colIndex].slice(from.cardIndex);
        setTableau((prev) =>
          prev.map((col, idx) => {
            if (idx === from.colIndex) {
              const remaining = col.slice(0, from.cardIndex);
              if (remaining.length > 0) {
                remaining[remaining.length - 1] = {
                  ...remaining[remaining.length - 1],
                  faceUp: true,
                };
              }
              return remaining;
            }
            if (idx === targetColIdx) {
              return [...col, ...cardsToMove];
            }
            return col;
          })
        );
      } else if (from.type === 'foundation') {
        setFoundations((prev) =>
          prev.map((f, idx) => (idx === from.index ? f.slice(0, -1) : f))
        );
        setTableau((prev) =>
          prev.map((col, idx) => (idx === targetColIdx ? [...col, card] : col))
        );
        setScore((s) => Math.max(0, s - 15));
      }

      setMoves((m) => m + 1);
      playCardPlace();
      return;
    }

    // Si no tiene destino legal
    playCardFlip();
  };

  // Drag & Drop con Pointer Events universales
  const handlePointerDownCard = (
    e: React.PointerEvent,
    card: Card,
    from: DraggingState['from']
  ) => {
    if (isWon || !card.faceUp) return;
    if (e.button !== 0) return; // Solo clic izquierdo principal

    const targetRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const offsetX = e.clientX - targetRect.left;
    const offsetY = e.clientY - targetRect.top;

    let cardsToDrag: Card[] = [card];
    if (from.type === 'tableau') {
      cardsToDrag = tableau[from.colIndex].slice(from.cardIndex);
    }

    setDragging({
      cards: cardsToDrag,
      from,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      offsetX,
      offsetY,
    });

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging((prev) =>
      prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;

    // Detectar si fue solo un clic estático (movimiento menor a 5px)
    const dist = Math.hypot(
      dragging.currentX - dragging.startX,
      dragging.currentY - dragging.startY
    );
    if (dist < 6) {
      handleSmartCardClick(dragging.cards[0], dragging.from);
      setDragging(null);
      return;
    }

    // Identificar el elemento sobre el que se soltó la carta
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    let targetFoundationIndex = -1;
    let targetTableauColIndex = -1;

    for (const el of elements) {
      const fAttr = el.getAttribute('data-foundation-index');
      if (fAttr !== null) {
        targetFoundationIndex = parseInt(fAttr, 10);
        break;
      }
      const tAttr = el.getAttribute('data-tableau-col');
      if (tAttr !== null) {
        targetTableauColIndex = parseInt(tAttr, 10);
        break;
      }
    }

    const card = dragging.cards[0];
    let moveExecuted = false;

    // Caso 1: Soltar en Fundación
    if (
      targetFoundationIndex !== -1 &&
      dragging.cards.length === 1 &&
      canPlaceOnFoundation(card, foundations[targetFoundationIndex])
    ) {
      saveSnapshot();
      setFoundations((prev) =>
        prev.map((pile, idx) =>
          idx === targetFoundationIndex ? [...pile, card] : pile
        )
      );

      if (dragging.from.type === 'waste') {
        setWaste((prev) => prev.slice(0, -1));
        setScore((s) => s + 10);
      } else if (dragging.from.type === 'tableau') {
        const fromCol = dragging.from.colIndex;
        setTableau((prev) =>
          prev.map((col, idx) => {
            if (idx !== fromCol) return col;
            const updated = col.slice(0, -1);
            if (updated.length > 0) {
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                faceUp: true,
              };
            }
            return updated;
          })
        );
        setScore((s) => s + 10);
      }
      setMoves((m) => m + 1);
      playFoundation();
      moveExecuted = true;
    }
    // Caso 2: Soltar en Tablero
    else if (
      targetTableauColIndex !== -1 &&
      !(
        dragging.from.type === 'tableau' &&
        dragging.from.colIndex === targetTableauColIndex
      ) &&
      canPlaceOnTableau(card, tableau[targetTableauColIndex])
    ) {
      saveSnapshot();

      if (dragging.from.type === 'waste') {
        setWaste((prev) => prev.slice(0, -1));
        setTableau((prev) =>
          prev.map((col, idx) =>
            idx === targetTableauColIndex ? [...col, card] : col
          )
        );
        setScore((s) => s + 5);
      } else if (dragging.from.type === 'tableau') {
        const fromCol = dragging.from.colIndex;
        const fromCardIdx = dragging.from.cardIndex;
        const moving = dragging.cards;

        setTableau((prev) =>
          prev.map((col, idx) => {
            if (idx === fromCol) {
              const remaining = col.slice(0, fromCardIdx);
              if (remaining.length > 0) {
                remaining[remaining.length - 1] = {
                  ...remaining[remaining.length - 1],
                  faceUp: true,
                };
              }
              return remaining;
            }
            if (idx === targetTableauColIndex) {
              return [...col, ...moving];
            }
            return col;
          })
        );
      } else if (dragging.from.type === 'foundation') {
        const fIdx = dragging.from.index;
        setFoundations((prev) =>
          prev.map((pile, idx) => (idx === fIdx ? pile.slice(0, -1) : pile))
        );
        setTableau((prev) =>
          prev.map((col, idx) =>
            idx === targetTableauColIndex ? [...col, card] : col
          )
        );
        setScore((s) => Math.max(0, s - 15));
      }
      setMoves((m) => m + 1);
      playCardPlace();
      moveExecuted = true;
    }

    if (!moveExecuted) {
      playCardFlip();
    }

    setDragging(null);
  };

  // Función de Auto-Completar cuando la partida ya está ganada
  const handleAutoComplete = () => {
    if (!canAutoComplete(stock, waste, tableau) || isWon) return;

    const timer = setInterval(() => {
      let moved = false;

      setTableau((currentTableau) => {
        setFoundations((currentFoundations) => {
          for (let colIdx = 0; colIdx < 7; colIdx++) {
            const col = currentTableau[colIdx];
            if (col.length > 0) {
              const top = col[col.length - 1];
              const fIdx = findLegalFoundation(top, currentFoundations);
              if (fIdx !== -1) {
                moved = true;
                playFoundation();

                // Actualizar fundaciones
                const nextF = currentFoundations.map((f, i) =>
                  i === fIdx ? [...f, top] : f
                );
                // Actualizar tablero
                const nextT = currentTableau.map((c, i) =>
                  i === colIdx ? c.slice(0, -1) : c
                );

                setTimeout(() => {
                  setFoundations(nextF);
                  setTableau(nextT);
                  setScore((s) => s + 10);
                }, 0);
                return currentFoundations;
              }
            }
          }
          return currentFoundations;
        });
        return currentTableau;
      });

      if (!moved) {
        clearInterval(timer);
      }
    }, 120);
  };

  // Atajos de teclado retro (F2: Nuevo juego, Ctrl+Z: Deshacer)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        startNewGame();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startNewGame, handleUndo]);

  const showAutoComplete = canAutoComplete(stock, waste, tableau) && !isWon;

  return (
    <div
      ref={boardRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="flex flex-col w-full h-full min-w-[620px] bg-[#076324] select-none text-white relative font-sans overflow-hidden"
    >
      {/* Barra de menú clásica de Windows 98 */}
      <div className="bg-[#C0C0C0] text-black text-[11px] flex items-center px-1 border-b border-[#808080] select-none relative z-30">
        {/* Menú Juego */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenMenu(openMenu === 'juego' ? null : 'juego')}
            className={`px-2 py-0.5 hover:bg-[#000080] hover:text-white ${
              openMenu === 'juego' ? 'bg-[#000080] text-white' : ''
            }`}
          >
            <span className="underline">J</span>uego
          </button>
          {openMenu === 'juego' && (
            <div
              className="absolute top-full left-0 bg-[#C0C0C0] win-raised shadow-md py-1 min-w-[170px] z-50 text-black text-[11px]"
              onClick={() => setOpenMenu(null)}
            >
              <button
                type="button"
                onClick={startNewGame}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex justify-between"
              >
                <span>Repartir nuevo</span>
                <span className="text-gray-500 hover:text-white">F2</span>
              </button>
              <button
                type="button"
                onClick={handleUndo}
                disabled={history.length === 0}
                className={`w-full text-left px-3 py-1 flex justify-between ${
                  history.length === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'hover:bg-[#000080] hover:text-white'
                }`}
              >
                <span>Deshacer</span>
                <span className="text-gray-500 hover:text-white">Ctrl+Z</span>
              </button>
              <div className="h-[1px] bg-gray-400 my-1 mx-1" />
              <button
                type="button"
                onClick={() => setShowBackDialog(true)}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
              >
                Opción de baraja...
              </button>
              <div className="h-[1px] bg-gray-400 my-1 mx-1" />
              <button
                type="button"
                onClick={() => dispatch({ type: 'CLOSE', id: 'solitaire' })}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
              >
                Salir
              </button>
            </div>
          )}
        </div>

        {/* Menú Opciones */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenMenu(openMenu === 'opciones' ? null : 'opciones')}
            className={`px-2 py-0.5 hover:bg-[#000080] hover:text-white ${
              openMenu === 'opciones' ? 'bg-[#000080] text-white' : ''
            }`}
          >
            <span className="underline">O</span>pciones
          </button>
          {openMenu === 'opciones' && (
            <div
              className="absolute top-full left-0 bg-[#C0C0C0] win-raised shadow-md py-1 min-w-[150px] z-50 text-black text-[11px]"
              onClick={() => setOpenMenu(null)}
            >
              <button
                type="button"
                onClick={() => {
                  setDrawMode(1);
                  startNewGame();
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center space-x-2"
              >
                <span>{drawMode === 1 ? '✓' : ' '}</span>
                <span>Robar 1 carta</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDrawMode(3);
                  startNewGame();
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex items-center space-x-2"
              >
                <span>{drawMode === 3 ? '✓' : ' '}</span>
                <span>Robar 3 cartas</span>
              </button>
            </div>
          )}
        </div>

        {/* Menú Ayuda */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenMenu(openMenu === 'ayuda' ? null : 'ayuda')}
            className={`px-2 py-0.5 hover:bg-[#000080] hover:text-white ${
              openMenu === 'ayuda' ? 'bg-[#000080] text-white' : ''
            }`}
          >
            <span className="underline">A</span>yuda
          </button>
          {openMenu === 'ayuda' && (
            <div
              className="absolute top-full left-0 bg-[#C0C0C0] win-raised shadow-md py-1 min-w-[150px] z-50 text-black text-[11px]"
              onClick={() => setOpenMenu(null)}
            >
              <button
                type="button"
                onClick={() => setShowHelpDialog(true)}
                className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
              >
                Cómo jugar Solitario
              </button>
            </div>
          )}
        </div>

        {/* Botón rápido de Auto-Completar si está disponible */}
        {showAutoComplete && (
          <button
            type="button"
            onClick={handleAutoComplete}
            className="ml-auto mr-1 px-2 py-0.5 bg-yellow-300 text-black font-bold win-raised text-[10px] animate-pulse flex items-center space-x-1"
          >
            <span>⚡</span>
            <span>Auto-completar</span>
          </button>
        )}
      </div>

      {/* Tapete Verde Clásico */}
      <div
        className="flex-1 p-4 flex flex-col justify-between overflow-x-auto relative"
        onClick={() => openMenu && setOpenMenu(null)}
      >
        {/* Fila Superior: Stock, Waste y las 4 Fundaciones */}
        <div className="flex items-center justify-between max-w-[660px] mx-auto w-full mb-4">
          {/* Izquierda: Mazo y Descarte */}
          <div className="flex items-center space-x-3">
            {/* Mazo (Stock) */}
            <div
              onClick={handleStockClick}
              className="w-[66px] h-[92px] rounded-[3px] border border-dashed border-emerald-900/60 bg-emerald-900/20 flex items-center justify-center cursor-pointer select-none relative"
            >
              {stock.length > 0 ? (
                <div className="w-full h-full">
                  <CardBackView theme={cardBack} />
                  <span className="absolute bottom-1 right-1.5 bg-black/60 text-white text-[9px] font-mono px-1 rounded">
                    {stock.length}
                  </span>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full border border-emerald-400/40 flex items-center justify-center text-emerald-300/60 text-xs">
                  ↺
                </div>
              )}
            </div>

            {/* Descarte (Waste) */}
            <div className="w-[66px] h-[92px] rounded-[3px] border border-dashed border-emerald-900/40 relative">
              {waste.length > 0 && (
                <div
                  onPointerDown={(e) =>
                    handlePointerDownCard(e, waste[waste.length - 1], {
                      type: 'waste',
                    })
                  }
                >
                  <CardView
                    card={waste[waste.length - 1]}
                    cardBack={cardBack}
                    isGhost={
                      dragging?.from.type === 'waste' &&
                      dragging.cards[0].id === waste[waste.length - 1].id
                    }
                  />
                </div>
              )}
            </div>
          </div>

          {/* Derecha: 4 Fundaciones (As a Rey por palo) */}
          <div className="flex items-center space-x-3">
            {foundations.map((pile, fIdx) => {
              const topCard = pile.length > 0 ? pile[pile.length - 1] : null;
              const suitIcons = ['♠', '♥', '♦', '♣'];

              return (
                <div
                  key={fIdx}
                  data-foundation-index={fIdx}
                  className="w-[66px] h-[92px] rounded-[3px] border border-dashed border-emerald-300/40 bg-emerald-900/30 flex items-center justify-center relative select-none"
                >
                  {topCard ? (
                    <div
                      onPointerDown={(e) =>
                        handlePointerDownCard(e, topCard, {
                          type: 'foundation',
                          index: fIdx,
                        })
                      }
                      className="w-full h-full"
                    >
                      <CardView
                        card={topCard}
                        cardBack={cardBack}
                        isGhost={
                          dragging?.from.type === 'foundation' &&
                          dragging.from.index === fIdx
                        }
                      />
                    </div>
                  ) : (
                    <span className="text-emerald-400/30 text-xl font-bold select-none pointer-events-none">
                      {suitIcons[fIdx]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Fila Inferior: 7 Columnas del Tablero (Tableau) */}
        <div className="flex items-start justify-between max-w-[660px] mx-auto w-full flex-1 min-h-[300px]">
          {tableau.map((column, colIdx) => {
            return (
              <div
                key={colIdx}
                data-tableau-col={colIdx}
                className="w-[66px] min-h-[92px] rounded-[3px] border border-dashed border-emerald-900/30 bg-emerald-900/10 relative flex flex-col"
              >
                {column.map((card, cardIdx) => {
                  const isDraggingThis =
                    dragging?.from.type === 'tableau' &&
                    dragging.from.colIndex === colIdx &&
                    cardIdx >= dragging.from.cardIndex;

                  // Desplazamiento vertical en cascada: boca abajo más pegadas (~14px), boca arriba (~22px)
                  const topOffset = column
                    .slice(0, cardIdx)
                    .reduce((acc, c) => acc + (c.faceUp ? 22 : 13), 0);

                  return (
                    <div
                      key={card.id}
                      style={{
                        position: 'absolute',
                        top: `${topOffset}px`,
                        left: 0,
                        zIndex: cardIdx + 1,
                      }}
                      onPointerDown={(e) => {
                        if (card.faceUp) {
                          handlePointerDownCard(e, card, {
                            type: 'tableau',
                            colIndex: colIdx,
                            cardIndex: cardIdx,
                          });
                        }
                      }}
                    >
                      <CardView
                        card={card}
                        cardBack={cardBack}
                        isGhost={isDraggingThis}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tarjetas flotantes mientras se arrastran */}
      {dragging && (
        <div
          style={{
            position: 'fixed',
            left: `${dragging.currentX - dragging.offsetX}px`,
            top: `${dragging.currentY - dragging.offsetY}px`,
            pointerEvents: 'none',
            zIndex: 9999,
          }}
          className="flex flex-col select-none filter drop-shadow-lg"
        >
          {dragging.cards.map((c, idx) => (
            <div
              key={c.id}
              style={{
                marginTop: idx > 0 ? '-70px' : '0',
              }}
            >
              <CardView card={c} cardBack={cardBack} />
            </div>
          ))}
        </div>
      )}

      {/* Barra de Estado inferior clásica de Windows 98 */}
      <div className="bg-[#C0C0C0] text-black text-[11px] h-[22px] px-2 flex items-center justify-between border-t border-[#808080] select-none font-mono">
        <div className="flex items-center space-x-4">
          <div className="win-sunken px-2 py-[1px] bg-white min-w-[100px]">
            Puntuación: <span className="font-bold">{score}</span>
          </div>
          <div className="win-sunken px-2 py-[1px] bg-white min-w-[90px]">
            Tiempo: <span className="font-bold">{timerSeconds}s</span>
          </div>
          <div className="win-sunken px-2 py-[1px] bg-white min-w-[100px]">
            Movimientos: <span className="font-bold">{moves}</span>
          </div>
        </div>

        <div className="text-[10px] text-gray-600 font-sans hidden sm:block">
          Modo: Robar {drawMode}
        </div>
      </div>

      {/* Diálogo de selección de Baraja */}
      {showBackDialog && (
        <CardBackDialog
          currentTheme={cardBack}
          onSelect={(theme) => setCardBack(theme)}
          onClose={() => setShowBackDialog(false)}
        />
      )}

      {/* Diálogo de Ayuda */}
      {showHelpDialog && (
        <div className="absolute inset-0 z-50 bg-black/30 flex items-center justify-center p-4 select-none">
          <div className="win-raised bg-[#C0C0C0] p-[3px] w-full max-w-[380px] text-black">
            <div className="win-titlebar-active flex items-center justify-between px-1.5 py-0.5 mb-2">
              <span className="text-[11px] font-bold">Ayuda de Solitario</span>
              <button
                type="button"
                onClick={() => setShowHelpDialog(false)}
                className="win-button w-4 h-[14px] p-0 font-bold text-[9px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="p-3 text-[11px] leading-relaxed win-sunken bg-white max-h-[260px] overflow-y-auto">
              <h3 className="font-bold text-[12px] mb-1">Objetivo del juego:</h3>
              <p className="mb-2">
                Construir las cuatro fundaciones superiores en orden ascendente
                desde el As hasta el Rey (A, 2, 3... K) para cada uno de los
                cuatro palos.
              </p>
              <h3 className="font-bold text-[12px] mb-1">Reglas del tablero:</h3>
              <ul className="list-disc pl-4 space-y-1 mb-2">
                <li>
                  Las cartas en el tablero se colocan en orden descendente
                  alternando colores (rojo sobre negro y viceversa).
                </li>
                <li>
                  Solo los Reyes (K) pueden ocupar una columna vacía en el
                  tablero.
                </li>
                <li>
                  Haz clic en el mazo para descubrir cartas.
                </li>
                <li>
                  Haz un solo clic sobre cualquier carta para moverla
                  automáticamente a la mejor casilla disponible.
                </li>
              </ul>
              <h3 className="font-bold text-[12px] mb-1">Atajos útiles:</h3>
              <p>
                <b>F2:</b> Nueva partida &bull; <b>Ctrl+Z:</b> Deshacer
              </p>
            </div>
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => setShowHelpDialog(false)}
                className="win-button win-button-default min-w-[70px] py-0.5 text-[11px] font-bold"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cascada de Victoria clásica de Windows 98 */}
      {isWon && (
        <VictoryCascade
          foundations={foundations}
          cardBack={cardBack}
          onDismiss={startNewGame}
        />
      )}
    </div>
  );
};
