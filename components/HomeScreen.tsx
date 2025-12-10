import React from 'react';
import { Ghost, Users } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';

interface HomeScreenProps {
  onCreateGame: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onCreateGame }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center animate-fade-in">
      <div className="mb-8 relative">
        <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <Ghost size={80} className="text-indigo-400 relative z-10" />
      </div>
      
      <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 mb-2 tracking-tight">
        IMPOSTOR
      </h1>
      <p className="text-slate-400 text-lg mb-10 max-w-md leading-relaxed">
        A ver, descifren al cuentero. Todos saben la palabra… menos el impostor que está improvisando más que vallenatero en parranda.
      </p>

      <Card className="space-y-6">
        <div className="flex items-center justify-center space-x-4 text-slate-500 mb-2">
          <div className="flex items-center gap-2">
            <Users size={20} />
            <span>3 - 20 Jugadores</span>
          </div>
        </div>
        <Button onClick={onCreateGame} fullWidth>
          Crear Partida
        </Button>
      </Card>
      
      <footer className="absolute bottom-6 flex flex-col items-center gap-1">
        <span className="text-slate-600 text-sm">Juego social de deducción</span>
        <span className="text-slate-700 text-xs opacity-60">Hecho por Camilo Henriquez</span>
      </footer>
    </div>
  );
};