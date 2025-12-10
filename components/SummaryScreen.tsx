import React from 'react';
import { RotateCcw, User, Skull } from 'lucide-react';
import { Button } from './Button';
import { Player } from '../types';

interface SummaryScreenProps {
  players: Player[];
  word: string;
  onReset: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({ players, word, onReset }) => {
  return (
    <div className="min-h-screen p-4 py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-2">Resultados</h1>
      <p className="text-slate-400 mb-8">La palabra era: <span className="text-indigo-400 font-bold uppercase">{word}</span></p>

      <div className="w-full max-w-md space-y-3 mb-8">
        {players.map((player) => (
          <div 
            key={player.id} 
            className={`flex items-center justify-between p-4 rounded-xl border ${
              player.role === 'IMPOSTOR' 
                ? 'bg-rose-950/30 border-rose-900/50' 
                : 'bg-slate-800 border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className={`flex-shrink-0 p-2 rounded-full ${player.role === 'IMPOSTOR' ? 'bg-rose-900/50' : 'bg-slate-700'}`}>
                {player.role === 'IMPOSTOR' ? (
                  <Skull size={20} className="text-rose-500" />
                ) : (
                  <User size={20} className="text-slate-400" />
                )}
              </div>
              <span className={`font-medium truncate ${player.role === 'IMPOSTOR' ? 'text-rose-200' : 'text-slate-200'}`}>
                {player.name}
              </span>
            </div>
            <span className={`text-sm font-bold px-3 py-1 rounded-lg ml-2 ${
               player.role === 'IMPOSTOR' 
               ? 'bg-rose-600 text-white' 
               : 'bg-slate-700 text-slate-400'
            }`}>
              {player.role === 'IMPOSTOR' ? 'IMPOSTOR' : 'CIVIL'}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-md">
        <Button onClick={onReset} fullWidth>
          <RotateCcw className="mr-2" size={20} />
          Jugar de Nuevo
        </Button>
      </div>
    </div>
  );
};
