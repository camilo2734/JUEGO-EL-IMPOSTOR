import React, { useState } from 'react';
import { Eye, EyeOff, User, Lightbulb, ShieldAlert, Fingerprint } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { Player } from '../types';

interface RoleRevealScreenProps {
  player: Player;
  playerIndex: number;
  totalPlayers: number;
  onNext: () => void;
  hintsEnabled?: boolean;
}

export const RoleRevealScreen: React.FC<RoleRevealScreenProps> = ({ 
  player, 
  playerIndex, 
  totalPlayers, 
  onNext,
  hintsEnabled = false
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleNext = () => {
    setIsRevealed(false);
    onNext();
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mb-8 flex justify-between items-center text-slate-400 font-semibold tracking-wide uppercase text-sm">
        <span className="bg-white/5 px-3 py-1 rounded-full border border-white/5">Turno {playerIndex + 1} / {totalPlayers}</span>
        <div className="flex items-center gap-2">
            <Fingerprint size={16} />
            <span>Top Secret</span>
        </div>
      </div>

      <Card className="min-h-[460px] flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-500">
        {!isRevealed ? (
          <div className="space-y-10 animate-fade-in w-full relative z-10">
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full"></div>
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center mx-auto border-4 border-slate-700 shadow-2xl relative z-10">
                    <User size={64} className="text-slate-400" />
                </div>
            </div>
            
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-3">Entregar dispositivo a</p>
              <h2 className="text-4xl font-black text-white mb-2 break-words drop-shadow-lg">{player.name}</h2>
            </div>
            <Button onClick={() => setIsRevealed(true)} className="w-full mt-8" variant="primary">
              <Eye className="mr-2" size={20} />
              Ver Identidad
            </Button>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in w-full relative z-10">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 mb-8 opacity-70">
                 <User size={16} className="text-slate-400" />
                 <h3 className="text-lg font-bold text-slate-300">{player.name}</h3>
              </div>
              
              <p className="text-slate-500 uppercase tracking-[0.3em] text-xs font-bold">Tu Misión</p>
              
              {player.role === 'IMPOSTOR' ? (
                <div className="py-4">
                   <div className="inline-block p-4 bg-rose-500/10 rounded-full mb-4 border border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                     <ShieldAlert size={48} className="text-rose-500" />
                   </div>
                   <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-rose-400 to-red-600 mb-2 drop-shadow-sm">IMPOSTOR</h2>
                   
                   {hintsEnabled && player.word ? (
                     <div className="mt-8 bg-rose-950/40 border border-rose-500/30 p-5 rounded-2xl backdrop-blur-md">
                       <div className="flex items-center justify-center gap-2 text-rose-300 mb-2">
                         <Lightbulb size={16} className="text-amber-400" />
                         <span className="text-xs uppercase font-bold tracking-wider text-rose-300">Pista Clave</span>
                       </div>
                       <p className="text-2xl font-black text-white uppercase leading-relaxed tracking-wide drop-shadow-md">{player.word}</p>
                       <p className="text-rose-400/60 text-xs mt-3 font-medium">Usa esto para mezclarte entre los civiles.</p>
                     </div>
                   ) : (
                     <p className="text-rose-300/80 text-sm font-medium mt-4">Nadie sabe quién eres. Miente para sobrevivir.</p>
                   )}
                </div>
              ) : (
                <div className="py-4">
                   <div className="inline-block p-4 bg-indigo-500/10 rounded-full mb-4 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                     <User size={48} className="text-indigo-400" />
                   </div>
                   <h2 className="text-4xl font-black text-white mb-2 uppercase break-words px-2 tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{player.word}</h2>
                   <div className="inline-block px-4 py-1 rounded-full bg-indigo-900/50 border border-indigo-500/30 mt-2">
                      <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Ciudadano</p>
                   </div>
                </div>
              )}
            </div>
            
            <div className="pt-8 mt-4 border-t border-white/5">
              <Button onClick={handleNext} variant="secondary" fullWidth className="bg-slate-800/50">
                <EyeOff className="mr-2" size={20} />
                Ocultar y Siguiente
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};