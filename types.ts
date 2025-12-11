
export type Role = 'CIVILIAN' | 'IMPOSTOR';

export interface Player {
  id: number;
  name: string;
  role: Role;
  word?: string; // Impostors might have a hint phrase now
}

export enum GameStep {
  HOME = 'HOME',
  SETUP = 'SETUP',
  REVEAL_ROLES = 'REVEAL_ROLES',
  PLAYING = 'PLAYING',
  SUMMARY = 'SUMMARY'
}

export interface WordItem {
  target: string;
  hint: string;
}

export interface Category {
  id: string;
  name: string;
  items: WordItem[];
  isCustom?: boolean;
}

export interface GameConfig {
  totalPlayers: number;
  impostorCount: number;
  selectedCategoryIds: string[];
  hintsEnabled: boolean;
  customCategoryName: string;
  customCategoryWords: string;
  playerNames: string[];
}
