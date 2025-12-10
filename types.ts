export type Role = 'CIVILIAN' | 'IMPOSTOR';

export interface Player {
  id: number;
  name: string;
  role: Role;
  word?: string; // Impostors don't have a word
}

export enum GameStep {
  HOME = 'HOME',
  SETUP = 'SETUP',
  REVEAL_ROLES = 'REVEAL_ROLES',
  PLAYING = 'PLAYING',
  SUMMARY = 'SUMMARY'
}

export interface Category {
  id: string;
  name: string;
  words: string[];
  isCustom?: boolean;
}

export interface GameConfig {
  totalPlayers: number;
  impostorCount: number;
  selectedCategoryId: string;
  customCategoryName: string;
  customCategoryWords: string;
  playerNames: string[];
}
