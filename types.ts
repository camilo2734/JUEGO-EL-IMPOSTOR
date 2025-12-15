
export type Role = 'CIVILIAN' | 'IMPOSTOR';

export interface Player {
  id: number;
  name: string;
  role: Role;
  word?: string; // Impostors might have a hint phrase now
  otherImpostors?: string[]; // Names of other impostors if the setting is enabled
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
  isLocked?: boolean;
}

export interface GameConfig {
  totalPlayers: number;
  impostorCount: number;
  selectedCategoryIds: string[];
  hintsEnabled: boolean;
  impostorsKnowEachOther: boolean; // New setting
  customCategoryName: string;
  customCategoryWords: string;
  playerNames: string[];
}