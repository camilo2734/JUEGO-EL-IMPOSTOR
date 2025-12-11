import React, { useState, useEffect } from 'react';
import { Search, Clock, MessageCircle } from 'lucide-react';
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
      <div className="mb-10 animate-fade-in">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Debate en curso</span>
         </div>
         <h3 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">Categoría</h3>
         <div className="text-3xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 drop-shadow-sm">
           {categoryName}
         </div>
      </div>

      <Card className="py-10 space-y-10 animate-fade-in relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 text-slate-500 mb-2">
            <Clock size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Tiempo Transcurrido</span>
          </div>
          <h2 className="text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {formatTime(seconds)}
          </h2>
        </div>

        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 mx-2 backdrop-blur-sm relative z-10">
          <MessageCircle size={24} className="mx-auto text-indigo-400 mb-3 opacity-80" />
          <p className="text-slate-300 text-sm font-medium leading-relaxed">
            Hagan preguntas por turnos. <br/>
            El <span className="text-rose-400 font-bold">Impostor</span> debe mentir y pasar desapercibido.
          </p>
        </div>

        <Button onClick={onEndGame} variant="danger" fullWidth className="mt-8 relative z-10 shadow-rose-900/40">
          <Search size={20} className="mr-2" />
          Revelar Identidades
        </Button>
      </Card>
    </div>
  );
};