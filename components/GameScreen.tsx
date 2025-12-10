import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface GameScreenProps {
  onEndGame: () => void;
  categoryName: string;
}

export const GameScreen: React.FC<GameScreenProps> = ({ onEndGame, categoryName }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center text-center">
      <div className="mb-8">
         <h3 className="text-slate-400 text-sm uppercase tracking-wider mb-2">Categoría</h3>
         <div className="text-2xl font-bold text-indigo-300 bg-indigo-900/30 px-6 py-2 rounded-full border border-indigo-500/30">
           {categoryName}
         </div>
      </div>

      <Card className="py-12 space-y-8">
        <div>
          <h2 className="text-6xl font-black text-white tracking-tighter tabular-nums">
            {formatTime(seconds)}
          </h2>
          <p className="text-slate-500 mt-2">Tiempo de debate</p>
        </div>

        <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <p className="text-slate-300 text-sm leading-relaxed">
            Hagan preguntas por turnos. El impostor debe mentir y pasar desapercibido. ¡Voten cuando estén listos!
          </p>
        </div>

        <Button onClick={onEndGame} variant="danger" fullWidth className="mt-8">
          <Search size={20} className="mr-2" />
          Revelar Impostores
        </Button>
      </Card>
    </div>
  );
};
