import React from 'react';
import { RotateCcw, User, Skull, Target } from 'lucide-react';
import { Button } from './Button';
import { Player } from '../types';

interface SummaryScreenProps {
  players: Player[];
  word: string;
  onReset: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({ players, word, onReset }) => {
  return (
    <div className="min-h-screen p-4 py-12 flex flex-col items-center max-w-2xl mx-auto">
      <div className="text-center mb-10 animate-fade-in">
        <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Misión Terminada</h1>
        <div className="inline-flex items-center gap-2 bg-indigo-900/30 border border-indigo-500/30 px-5 py-3 rounded-2xl backdrop-blur-sm">
            <Target size={20} className="text-indigo-400" />
            <span className="text-slate-300 font-medium">La palabra era:</span>
            <span className="text-white font-black uppercase text-lg tracking-wide ml-1">{word}</span>
        </div>
      </div>

      <div className="w-full space-y-3 mb-10 animate-fade-in delay-100">
        {players.map((player) => (
          <div 
            key={player.id} 
            className={`flex items-center justify-between p-4 rounded-xl border backdrop-blur-sm transition-all hover:scale-[1.01] ${
              player.role === 'IMPOSTOR' 
                ? 'bg-gradient-to-r from-rose-950/40 to-rose-900/20 border-rose-500/30 shadow-lg shadow-rose-900/20' 
                : 'bg-black/40 border-white/5'
            }`}
          >
            <div className="flex items-center gap-4 overflow-hidden">
              <div className={`flex-shrink-0 p-2.5 rounded-xl ${player.role === 'IMPOSTOR' ? 'bg-rose-500/20 text-rose-500' : 'bg-slate-800 text-slate-400'}`}>
                {player.role === 'IMPOSTOR' ? (
                  <Skull size={20} />
                ) : (
                  <User size={20} />
                )}
              </div>
              <span className={`font-bold text-lg truncate ${player.role === 'IMPOSTOR' ? 'text-rose-100' : 'text-slate-200'}`}>
                {player.name}
              </span>
            </div>
            <span className={`text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-lg ml-2 border ${
               player.role === 'IMPOSTOR' 
               ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
               : 'bg-slate-800/50 text-slate-500 border-slate-700/50'
            }`}>
              {player.role === 'IMPOSTOR' ? 'IMPOSTOR' : 'CIVIL'}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-md animate-fade-in delay-200">
        <Button onClick={onReset} fullWidth variant="primary">
          <RotateCcw className="mr-2" size={20} />
          Jugar de Nuevo
        </Button>
      </div>
    </div>
  );
};