import type { Card, HistorySnapshot, Rank, Suit } from './types';
import { getSuitColor } from './CardView';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

/** Crea una baraja completa de 52 cartas */
export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank: rank as Rank,
        faceUp: false,
      });
    }
  }
  return deck;
};

/** Algoritmo de barajado Fisher-Yates */
export const shuffleDeck = (deck: Card[]): Card[] => {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/** Reparto inicial clásico de Klondike */
export const dealInitialGame = () => {
  const shuffled = shuffleDeck(createDeck());
  const tableau: Card[][] = [[], [], [], [], [], [], []];

  let cardIndex = 0;
  // Repartir en triángulo: Columna i tiene (i + 1) cartas, la última boca arriba
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = shuffled[cardIndex++];
      card.faceUp = row === col;
      tableau[col].push(card);
    }
  }

  // Las 24 cartas restantes forman el mazo de robo (Stock)
  const stock = shuffled.slice(cardIndex).map((c) => ({ ...c, faceUp: false }));

  return {
    tableau,
    stock,
    waste: [] as Card[],
    foundations: [[], [], [], []] as Card[][],
  };
};

/** Comprueba si una carta puede colocarse en una fundación */
export const canPlaceOnFoundation = (card: Card, foundation: Card[]): boolean => {
  if (foundation.length === 0) {
    return card.rank === 1; // Solo As
  }
  const top = foundation[foundation.length - 1];
  return top.suit === card.suit && card.rank === top.rank + 1;
};

/** Comprueba si una carta puede colocarse sobre una columna del tablero */
export const canPlaceOnTableau = (card: Card, column: Card[]): boolean => {
  if (column.length === 0) {
    return card.rank === 13; // Solo Reyes en columnas vacías
  }
  const top = column[column.length - 1];
  if (!top.faceUp) return false;
  const isOppositeColor = getSuitColor(card.suit) !== getSuitColor(top.suit);
  return isOppositeColor && card.rank === top.rank - 1;
};

/** Encuentra la primera fundación legal para una carta dada */
export const findLegalFoundation = (card: Card, foundations: Card[][]): number => {
  for (let i = 0; i < 4; i++) {
    if (canPlaceOnFoundation(card, foundations[i])) {
      return i;
    }
  }
  return -1;
};

/** Encuentra la mejor columna del tablero para una carta o secuencia */
export const findLegalTableau = (
  card: Card,
  tableau: Card[][],
  fromColIndex?: number
): number => {
  // Primero buscar columnas que tengan cartas para construir secuencia
  for (let i = 0; i < 7; i++) {
    if (i === fromColIndex) continue;
    if (tableau[i].length > 0 && canPlaceOnTableau(card, tableau[i])) {
      return i;
    }
  }
  // Si es un Rey, buscar una columna vacía (pero no si ya estaba solo en una columna vacía)
  if (card.rank === 13) {
    for (let i = 0; i < 7; i++) {
      if (i === fromColIndex) continue;
      if (tableau[i].length === 0) {
        return i;
      }
    }
  }
  return -1;
};

/** Comprueba si el juego está en condiciones de auto-completarse */
export const canAutoComplete = (
  stock: Card[],
  waste: Card[],
  tableau: Card[][]
): boolean => {
  if (stock.length > 0 || waste.length > 0) return false;
  // Todas las cartas restantes en las columnas del tablero deben estar boca arriba
  return tableau.every((col) => col.every((card) => card.faceUp));
};

/** Clona de forma profunda el estado para snapshots de Deshacer (Undo) */
export const cloneSnapshot = (
  stock: Card[],
  waste: Card[],
  foundations: Card[][],
  tableau: Card[][],
  score: number
): HistorySnapshot => {
  return {
    stock: stock.map((c) => ({ ...c })),
    waste: waste.map((c) => ({ ...c })),
    foundations: foundations.map((pile) => pile.map((c) => ({ ...c }))),
    tableau: tableau.map((col) => col.map((c) => ({ ...c }))),
    score,
  };
};
