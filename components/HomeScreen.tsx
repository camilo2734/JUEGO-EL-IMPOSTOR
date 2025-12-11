import React from 'react';
import { Ghost, Users, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface HomeScreenProps {
  onCreateGame: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onCreateGame }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="mb-10 relative animate-float">
        <div className="absolute -inset-10 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative z-10 bg-gradient-to-b from-indigo-900/50 to-slate-900/50 p-6 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">
           <Ghost size={80} className="text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
        </div>
      </div>
      
      <div className="animate-fade-in space-y-4 max-w-lg mx-auto mb-12">
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-slate-400 tracking-tight drop-shadow-sm">
          IMPOSTOR
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed font-medium">
          ¿Quién está mintiendo? <br/>
          <span className="text-indigo-300">Descubre al infiltrado</span> antes de que sea tarde.
        </p>
      </div>

      <Card className="space-y-6 animate-fade-in backdrop-blur-2xl">
        <div className="flex items-center justify-center space-x-4 text-slate-400 mb-2 font-medium">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
            <Users size={18} className="text-indigo-400" />
            <span>3 - 20 Jugadores</span>
          </div>
        </div>
        <Button onClick={onCreateGame} fullWidth className="text-xl">
          Crear Partida
          <ArrowRight size={20} />
        </Button>
      </Card>
      
      <footer className="absolute bottom-6 flex flex-col items-center gap-2 animate-fade-in opacity-50">
        <span className="text-slate-500 text-xs uppercase tracking-widest font-semibold">Juego Social de Deducción</span>
        <span className="text-slate-600 text-[10px] uppercase tracking-widest">Hecho por Camilo Henriquez</span>
      </footer>
    </div>
  );
};