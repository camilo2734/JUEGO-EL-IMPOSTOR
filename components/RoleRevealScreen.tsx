import React, { useState } from 'react';
import { Eye, EyeOff, User } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { Player } from '../types';

interface RoleRevealScreenProps {
  player: Player;
  playerIndex: number;
  totalPlayers: number;
  onNext: () => void;
}

export const RoleRevealScreen: React.FC<RoleRevealScreenProps> = ({ 
  player, 
  playerIndex, 
  totalPlayers, 
  onNext 
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleNext = () => {
    setIsRevealed(false);
    onNext();
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md mb-6 flex justify-between text-slate-500 font-medium">
        <span>Turno {playerIndex + 1} de {totalPlayers}</span>
        <span>Privado</span>
      </div>

      <Card className="min-h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden">
        {!isRevealed ? (
          <div className="space-y-8 animate-fade-in w-full">
            <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mx-auto border-4 border-slate-700">
              <User size={48} className="text-slate-400" />
            </div>
            <div>
              <p className="text-slate-500 text-sm uppercase tracking-widest mb-2">Entregar dispositivo a</p>
              <h2 className="text-3xl font-black text-white mb-2 break-words">{player.name}</h2>
            </div>
            <Button onClick={() => setIsRevealed(true)} className="w-full mt-8">
              <Eye className="mr-2" size={20} />
              Ver mi Rol
            </Button>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in w-full">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-300 mb-6">{player.name}</h3>
              <p className="text-slate-400 uppercase tracking-widest text-sm font-bold">Tu secreto es</p>
              
              {player.role === 'IMPOSTOR' ? (
                <div className="py-6">
                   <h2 className="text-4xl font-black text-rose-500 mb-2">ERES EL IMPOSTOR</h2>
                   <p className="text-rose-200/60 text-sm">Engaña a los demás. No sabes la palabra.</p>
                </div>
              ) : (
                <div className="py-6">
                  <h2 className="text-4xl font-black text-indigo-400 mb-2 uppercase break-words px-2">{player.word}</h2>
                  <p className="text-indigo-200/60 text-sm">Eres un Civil. Encuentra al impostor.</p>
                </div>
              )}
            </div>
            
            <div className="pt-8 border-t border-slate-800">
              <Button onClick={handleNext} variant="secondary" fullWidth>
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
