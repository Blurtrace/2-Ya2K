export type Difficulty = 'beginner' | 'intermediate' | 'expert';

export type DifficultyConfig = {
  name: Difficulty;
  labelKey: string;
  rows: number;
  cols: number;
  mines: number;
};

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  beginner: {
    name: 'beginner',
    labelKey: 'minesweeper.beginner',
    rows: 9,
    cols: 9,
    mines: 10,
  },
  intermediate: {
    name: 'intermediate',
    labelKey: 'minesweeper.intermediate',
    rows: 16,
    cols: 16,
    mines: 40,
  },
  expert: {
    name: 'expert',
    labelKey: 'minesweeper.expert',
    rows: 16,
    cols: 30,
    mines: 99,
  },
};

export type Cell = {
  row: number;
  col: number;
  hasMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  isQuestion: boolean;
  neighborMines: number;
  isExploded?: boolean;
  isFalseFlag?: boolean;
};

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type SmileyMood = 'idle' | 'surprised' | 'won' | 'lost';
