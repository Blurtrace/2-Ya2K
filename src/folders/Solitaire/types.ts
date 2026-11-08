export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type SuitColor = 'red' | 'black';

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type Card = {
  id: string; // ej: "hearts-1", "spades-13"
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
};

export type CardBackTheme = 'geometric' | 'castle' | 'beach' | 'robot' | 'roses';

export type DrawMode = 1 | 3;

export type CardLocation =
  | { pile: 'stock' }
  | { pile: 'waste' }
  | { pile: 'foundation'; foundationIndex: number }
  | { pile: 'tableau'; colIndex: number; cardIndex: number };

export type HistorySnapshot = {
  stock: Card[];
  waste: Card[];
  foundations: Card[][];
  tableau: Card[][];
  score: number;
};
