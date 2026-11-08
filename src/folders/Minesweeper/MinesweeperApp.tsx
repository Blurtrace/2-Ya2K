'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Difficulty,
  DIFFICULTIES,
  Cell,
  GameStatus,
  SmileyMood,
} from './types';
import { SevenSegmentDisplay } from './SevenSegmentDisplay';
import { SmileyButton } from './SmileyButton';
import { sounds } from './sounds';
import { useOs } from '@/os/state/OsContext';
import { useT } from '@/i18n/I18nContext';

const NUMBER_COLORS: Record<number, string> = {
  1: '#0000FF', // Blue
  2: '#008000', // Green
  3: '#FF0000', // Red
  4: '#000080', // Dark Blue
  5: '#800000', // Maroon
  6: '#008080', // Teal
  7: '#000000', // Black
  8: '#808080', // Gray
};

export const MinesweeperApp = () => {
  const { dispatch } = useOs();
  const { t } = useT();
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('idle');
  const [smileyMood, setSmileyMood] = useState<SmileyMood>('idle');
  const [minesLeft, setMinesLeft] = useState<number>(DIFFICULTIES.beginner.mines);
  const [timer, setTimer] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mobileMode, setMobileMode] = useState<'dig' | 'flag'>('dig');
  const [showGameMenu, setShowGameMenu] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMouseDownRef = useRef(false);

  const config = DIFFICULTIES[difficulty];

  // Initialize an empty board
  const createEmptyBoard = useCallback((rows: number, cols: number): Cell[][] => {
    const board: Cell[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < cols; c++) {
        row.push({
          row: r,
          col: c,
          hasMine: false,
          isRevealed: false,
          isFlagged: false,
          isQuestion: false,
          neighborMines: 0,
        });
      }
      board.push(row);
    }
    return board;
  }, []);

  // Reset / Start a fresh game
  const resetGame = useCallback((newDiff: Difficulty = difficulty) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const newConfig = DIFFICULTIES[newDiff];
    setDifficulty(newDiff);
    setGrid(createEmptyBoard(newConfig.rows, newConfig.cols));
    setGameStatus('idle');
    setSmileyMood('idle');
    setMinesLeft(newConfig.mines);
    setTimer(0);
    setShowGameMenu(false);

    // Ajuste de posición al cambiar de dificultad para no desbordar la pantalla
    if (typeof window !== 'undefined' && newDiff === 'expert') {
      const estimatedWidth = 640;
      if (window.innerWidth > 0) {
        const safeX = Math.max(12, Math.floor((window.innerWidth - estimatedWidth) / 2));
        dispatch({ type: 'MOVE', id: 'minesweeper', x: safeX, y: 35 });
      }
    }
  }, [difficulty, createEmptyBoard, dispatch]);

  // Initial mount
  useEffect(() => {
    resetGame(difficulty);
  }, []);

  // Timer interval effect
  useEffect(() => {
    if (gameStatus === 'playing') {
      timerRef.current = setInterval(() => {
        setTimer((prev) => Math.min(999, prev + 1));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus]);

  // Keyboard shortcut: F2 restarts game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        resetGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetGame]);

  // Generate mines with First-Click Safety (first click and neighbors are never mines)
  const populateMines = (
    initialGrid: Cell[][],
    firstRow: number,
    firstCol: number,
    totalMines: number
  ): Cell[][] => {
    const rows = initialGrid.length;
    const cols = initialGrid[0].length;
    const newGrid = initialGrid.map((row) => row.map((cell) => ({ ...cell })));

    let placed = 0;
    while (placed < totalMines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);

      // Safe zone: skip first clicked cell and its 8 adjacent cells
      const isSafeZone = Math.abs(r - firstRow) <= 1 && Math.abs(c - firstCol) <= 1;

      if (!newGrid[r][c].hasMine && !isSafeZone) {
        newGrid[r][c].hasMine = true;
        placed++;
      }
    }

    // Compute neighbor mine counts
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newGrid[r][c].hasMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newGrid[nr][nc].hasMine) {
              count++;
            }
          }
        }
        newGrid[r][c].neighborMines = count;
      }
    }

    return newGrid;
  };

  // Flood fill algorithm to reveal empty cluster
  const revealEmptyNeighbors = (board: Cell[][], startRow: number, startCol: number) => {
    const rows = board.length;
    const cols = board[0].length;
    const queue: [number, number][] = [[startRow, startCol]];

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;

          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            const neighbor = board[nr][nc];
            if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.hasMine) {
              neighbor.isRevealed = true;
              if (neighbor.neighborMines === 0) {
                queue.push([nr, nc]);
              }
            }
          }
        }
      }
    }
  };

  // Check victory condition
  const checkWin = (board: Cell[][], totalMines: number): boolean => {
    const rows = board.length;
    const cols = board[0].length;
    let revealedCount = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (board[r][c].isRevealed && !board[r][c].hasMine) {
          revealedCount++;
        }
      }
    }

    return revealedCount === rows * cols - totalMines;
  };

  // Left-click / Reveal cell action
  const handleCellClick = (r: number, c: number) => {
    if (gameStatus === 'won' || gameStatus === 'lost') return;

    let currentGrid = grid;

    // First click generates mines and starts timer
    if (gameStatus === 'idle') {
      currentGrid = populateMines(grid, r, c, config.mines);
      setGameStatus('playing');
    }

    const cell = currentGrid[r][c];

    // If flagged or already revealed, ignore
    if (cell.isFlagged) return;

    // If clicked on an already revealed number: Chord reveal
    if (cell.isRevealed && cell.neighborMines > 0) {
      handleChordClick(r, c, currentGrid);
      return;
    }

    if (cell.isRevealed) return;

    const newGrid = currentGrid.map((row) => row.map((item) => ({ ...item })));
    const target = newGrid[r][c];

    // STEP ON A MINE -> GAME OVER
    if (target.hasMine) {
      target.isRevealed = true;
      target.isExploded = true;

      // Reveal all other mines and false flags
      for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
          const cItem = newGrid[row][col];
          if (cItem.hasMine && !cItem.isFlagged) {
            cItem.isRevealed = true;
          } else if (!cItem.hasMine && cItem.isFlagged) {
            cItem.isFalseFlag = true;
          }
        }
      }

      setGrid(newGrid);
      setGameStatus('lost');
      setSmileyMood('lost');
      if (soundEnabled) sounds.playExplosion();
      return;
    }

    // SAFE CELL
    target.isRevealed = true;
    if (soundEnabled) sounds.playClick();

    // If zero neighbor mines, expand cluster
    if (target.neighborMines === 0) {
      revealEmptyNeighbors(newGrid, r, c);
    }

    // Check Win
    if (checkWin(newGrid, config.mines)) {
      // Flag all remaining mines
      for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
          if (newGrid[row][col].hasMine) {
            newGrid[row][col].isFlagged = true;
          }
        }
      }
      setGrid(newGrid);
      setGameStatus('won');
      setSmileyMood('won');
      setMinesLeft(0);
      if (soundEnabled) sounds.playWin();
      return;
    }

    setGrid(newGrid);
  };

  // Right-click / Flag cell action
  const handleCellRightClick = (r: number, c: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (gameStatus === 'won' || gameStatus === 'lost') return;

    const cell = grid[r][c];
    if (cell.isRevealed) return;

    const newGrid = grid.map((row) => row.map((item) => ({ ...item })));
    const target = newGrid[r][c];

    if (!target.isFlagged && !target.isQuestion) {
      target.isFlagged = true;
      setMinesLeft((prev) => prev - 1);
      if (soundEnabled) sounds.playFlag();
    } else if (target.isFlagged) {
      target.isFlagged = false;
      target.isQuestion = true;
      setMinesLeft((prev) => prev + 1);
    } else {
      target.isQuestion = false;
    }

    setGrid(newGrid);
  };

  // Chord click: clicking revealed number when adjacent flags match the number
  const handleChordClick = (r: number, c: number, currentGrid: Cell[][]) => {
    const cell = currentGrid[r][c];
    if (!cell.isRevealed || cell.neighborMines === 0) return;

    // Count adjacent flags
    let flagCount = 0;
    const neighbors: [number, number][] = [];

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
          neighbors.push([nr, nc]);
          if (currentGrid[nr][nc].isFlagged) {
            flagCount++;
          }
        }
      }
    }

    if (flagCount !== cell.neighborMines) return;

    const newGrid = currentGrid.map((row) => row.map((item) => ({ ...item })));
    let steppedOnMine = false;

    for (const [nr, nc] of neighbors) {
      const neighbor = newGrid[nr][nc];
      if (!neighbor.isRevealed && !neighbor.isFlagged) {
        neighbor.isRevealed = true;
        if (neighbor.hasMine) {
          neighbor.isExploded = true;
          steppedOnMine = true;
        } else if (neighbor.neighborMines === 0) {
          revealEmptyNeighbors(newGrid, nr, nc);
        }
      }
    }

    if (steppedOnMine) {
      for (let row = 0; row < config.rows; row++) {
        for (let col = 0; col < config.cols; col++) {
          const cItem = newGrid[row][col];
          if (cItem.hasMine && !cItem.isFlagged) {
            cItem.isRevealed = true;
          } else if (!cItem.hasMine && cItem.isFlagged) {
            cItem.isFalseFlag = true;
          }
        }
      }
      setGrid(newGrid);
      setGameStatus('lost');
      setSmileyMood('lost');
      if (soundEnabled) sounds.playExplosion();
      return;
    }

    if (soundEnabled) sounds.playClick();

    if (checkWin(newGrid, config.mines)) {
      setGrid(newGrid);
      setGameStatus('won');
      setSmileyMood('won');
      setMinesLeft(0);
      if (soundEnabled) sounds.playWin();
      return;
    }

    setGrid(newGrid);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (r: number, c: number) => {
    longPressTimerRef.current = setTimeout(() => {
      // Long press triggers flag
      handleCellRightClick(r, c);
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.(40);
      }
      longPressTimerRef.current = null;
    }, 380);
  };

  const handleTouchEnd = (r: number, c: number) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;

      if (mobileMode === 'flag') {
        handleCellRightClick(r, c);
      } else {
        handleCellClick(r, c);
      }
    }
  };

  return (
    <div
      className="flex flex-col bg-[#C0C0C0] text-black select-none font-sans w-fit"
      onMouseUp={() => {
        isMouseDownRef.current = false;
        if (gameStatus === 'playing') setSmileyMood('idle');
      }}
    >
      {/* Barra de Menú Clásica de Windows 98 */}
      <div className="relative flex items-center space-x-3 px-1.5 py-0.5 border-b border-[#808080] text-[11px] bg-[#C0C0C0] z-20">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowGameMenu(!showGameMenu)}
            className="hover:bg-[#000080] hover:text-white px-1.5 py-0.5 cursor-pointer select-none"
          >
            {t('menu.game')}
          </button>

          {/* Menú desplegable */}
          {showGameMenu && (
            <div className="absolute top-full left-0 mt-0.5 win-raised bg-[#C0C0C0] p-1 w-[160px] text-[11px] shadow-md z-30">
              <button
                type="button"
                onClick={() => resetGame(difficulty)}
                className="w-full flex items-center justify-between px-2 py-1 text-left hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                <span>{t('menu.new')}</span>
                <span className="text-[9px] text-gray-600 hover:text-white">F2</span>
              </button>
              <div className="my-1 border-t border-[#808080]" />
              <button
                type="button"
                onClick={() => resetGame('beginner')}
                className="w-full flex items-center justify-between px-2 py-1 text-left hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                <span>{t('minesweeper.beginner')}</span>
                {difficulty === 'beginner' && <span className="font-bold">✓</span>}
              </button>
              <button
                type="button"
                onClick={() => resetGame('intermediate')}
                className="w-full flex items-center justify-between px-2 py-1 text-left hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                <span>{t('minesweeper.intermediate')}</span>
                {difficulty === 'intermediate' && <span className="font-bold">✓</span>}
              </button>
              <button
                type="button"
                onClick={() => resetGame('expert')}
                className="w-full flex items-center justify-between px-2 py-1 text-left hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                <span>{t('minesweeper.expert')}</span>
                {difficulty === 'expert' && <span className="font-bold">✓</span>}
              </button>
              <div className="my-1 border-t border-[#808080]" />
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="w-full flex items-center justify-between px-2 py-1 text-left hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                <span>{t('minesweeper.soundEffects')}</span>
                {soundEnabled && <span className="font-bold">✓</span>}
              </button>
              <div className="my-1 border-t border-[#808080]" />
              <button
                type="button"
                onClick={() => dispatch({ type: 'CLOSE', id: 'minesweeper' })}
                className="w-full flex items-center px-2 py-1 text-left hover:bg-[#000080] hover:text-white cursor-pointer"
              >
                {t('menu.exit')}
              </button>
            </div>
          )}
        </div>

        {/* Toggle para dispositivos táctiles */}
        <div className="sm:hidden flex items-center gap-1 ml-auto">
          <button
            type="button"
            onClick={() => setMobileMode(mobileMode === 'dig' ? 'flag' : 'dig')}
            className={`px-1.5 py-0.5 text-[10px] font-bold border border-[#808080] flex items-center gap-1 ${
              mobileMode === 'flag' ? 'bg-[#FFFF00] text-black win-pressed' : 'win-button'
            }`}
          >
            <span>{mobileMode === 'flag' ? `🚩 ${t('minesweeper.flag')}` : `⛏️ ${t('minesweeper.dig')}`}</span>
          </button>
        </div>
      </div>

      {/* Contenedor Principal del Juego con marco biselado que ajusta al tamaño exacto */}
      <div className="p-1.5 bg-[#C0C0C0] flex flex-col items-center w-fit">
        <div className="border-t-[3px] border-l-[3px] border-white border-r-[3px] border-b-[3px] border-r-[#808080] border-b-[#808080] bg-[#C0C0C0] p-1.5 flex flex-col items-stretch w-fit">
          {/* Cabecera del juego: Display LED izquierdo, Cara Sonriente, Display LED derecho */}
          <div className="border-t-[2px] border-l-[2px] border-[#808080] border-r-[2px] border-b-[2px] border-r-white border-b-white bg-[#C0C0C0] px-2 py-1 mb-1.5 flex items-center justify-between w-full">
            {/* Minas restantes */}
            <SevenSegmentDisplay value={minesLeft} />

            {/* Botón Smiley central */}
            <SmileyButton
              mood={smileyMood}
              onClick={() => resetGame(difficulty)}
            />

            {/* Temporizador */}
            <SevenSegmentDisplay value={timer} />
          </div>

          {/* Tablero de minas con marco hundido */}
          <div
            className="border-t-[3px] border-l-[3px] border-[#808080] border-r-[3px] border-b-[3px] border-r-white border-b-white bg-[#808080] p-[2px] inline-block overflow-auto max-w-[calc(100vw-36px)]"
            onContextMenu={(e) => e.preventDefault()}
          >
            <div
              className="grid gap-[1px] bg-[#808080]"
              style={{
                gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
              }}
            >
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  const isRevealed = cell.isRevealed;
                  const isExploded = cell.isExploded;
                  const isFalseFlag = cell.isFalseFlag;

                  return (
                    <button
                      key={`${r}-${c}`}
                      type="button"
                      onMouseDown={(e) => {
                        if (e.button === 0 && !cell.isRevealed && !cell.isFlagged) {
                          isMouseDownRef.current = true;
                          if (gameStatus !== 'lost' && gameStatus !== 'won') {
                            setSmileyMood('surprised');
                          }
                        }
                      }}
                      onMouseUp={() => {
                        isMouseDownRef.current = false;
                        if (gameStatus !== 'lost' && gameStatus !== 'won') {
                          setSmileyMood('idle');
                        }
                      }}
                      onClick={() => handleCellClick(r, c)}
                      onContextMenu={(e) => handleCellRightClick(r, c, e)}
                      onTouchStart={() => handleTouchStart(r, c)}
                      onTouchEnd={() => handleTouchEnd(r, c)}
                      className={`w-[18px] sm:w-[20px] h-[18px] sm:h-[20px] flex items-center justify-center text-[12px] font-extrabold select-none p-0 cursor-pointer ${
                        isExploded
                          ? 'bg-[#FF0000] border border-[#808080]'
                          : isRevealed
                          ? 'bg-[#C0C0C0] border border-[#808080] border-t-0 border-l-0'
                          : 'win-raised bg-[#C0C0C0] active:win-sunken'
                      }`}
                    >
                      {/* Contenido de la celda */}
                      {cell.isFlagged ? (
                        <span className="text-[12px] leading-none" title="Bandera">
                          🚩
                        </span>
                      ) : cell.isQuestion && !isRevealed ? (
                        <span className="text-[11px] font-bold text-black leading-none">
                          ?
                        </span>
                      ) : isFalseFlag ? (
                        <span className="text-[11px] font-bold text-red-700 leading-none" title="Bandera incorrecta">
                          ❌
                        </span>
                      ) : isRevealed && cell.hasMine ? (
                        <span className="text-[11px] leading-none" title="Mina">
                          💣
                        </span>
                      ) : isRevealed && cell.neighborMines > 0 ? (
                        <span
                          style={{
                            color: NUMBER_COLORS[cell.neighborMines] || '#000',
                          }}
                          className="leading-none"
                        >
                          {cell.neighborMines}
                        </span>
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Mensaje de estado al ganar o perder (compacto de 1 línea) */}
        {gameStatus === 'won' && (
          <div className="mt-1.5 win-raised bg-[#C0C0C0] px-2 py-0.5 text-center font-bold text-green-800 text-[10px] w-full truncate">
            🎉 ¡Despejado en {timer} segundos!
          </div>
        )}
        {gameStatus === 'lost' && (
          <div className="mt-1.5 win-raised bg-[#C0C0C0] px-2 py-0.5 text-center font-bold text-red-800 text-[10px] w-full truncate">
            💥 ¡Boom! Pulsa la carita o F2
          </div>
        )}
      </div>
    </div>
  );
};
