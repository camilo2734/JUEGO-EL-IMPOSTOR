import React, { useState, useEffect } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { CATEGORIES } from '../constants';
import { GameConfig } from '../types';

interface SetupScreenProps {
  onStartGame: (config: GameConfig) => void;
  onBack: () => void;
  initialPlayerNames?: string[];
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame, onBack, initialPlayerNames = [] }) => {
  const [totalPlayers, setTotalPlayers] = useState(initialPlayerNames.length > 0 ? initialPlayerNames.length : 4);
  const [impostorCount, setImpostorCount] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState(CATEGORIES[0].id);
  const [customName, setCustomName] = useState('');
  const [customWords, setCustomWords] = useState('');
  const [playerNames, setPlayerNames] = useState<string[]>(initialPlayerNames.length > 0 ? initialPlayerNames : []);

  // Sync playerNames array with totalPlayers count
  useEffect(() => {
    setPlayerNames(prev => {
      const newNames = [...prev];
      if (totalPlayers > prev.length) {
        // Add empty strings for new players
        for (let i = prev.length; i < totalPlayers; i++) {
          newNames.push('');
        }
      } else {
        // Truncate if fewer players
        newNames.length = totalPlayers;
      }
      return newNames;
    });
  }, [totalPlayers]);

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const isCustom = selectedCategoryId === 'custom';

  const handleStart = () => {
    // Fill empty names with defaults if necessary
    const finalNames = playerNames.map((name, index) => 
      name.trim() === '' ? `Jugador ${index + 1}` : name.trim()
    );

    onStartGame({
      totalPlayers,
      impostorCount,
      selectedCategoryId,
      customCategoryName: customName,
      customCategoryWords: customWords,
      playerNames: finalNames
    });
  };

  const incrementPlayers = () => setTotalPlayers(p => Math.min(20, p + 1));
  const decrementPlayers = () => {
    setTotalPlayers(p => {
      const newTotal = Math.max(3, p - 1);
      if (impostorCount >= newTotal) setImpostorCount(newTotal - 1);
      return newTotal;
    });
  };

  const incrementImpostors = () => setImpostorCount(i => Math.min(totalPlayers - 1, i + 1));
  const decrementImpostors = () => setImpostorCount(i => Math.max(1, i - 1));

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center">
      <Card className="space-y-8 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold text-slate-100">Configuración</h2>
          <div className="w-6"></div>
        </div>

        {/* Player Count */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Jugadores</label>
          <div className="flex items-center justify-between bg-slate-800 p-2 rounded-2xl border border-slate-700">
            <button onClick={decrementPlayers} className="w-12 h-12 flex items-center justify-center bg-slate-700 rounded-xl text-white hover:bg-slate-600 transition">-</button>
            <span className="text-2xl font-bold text-white">{totalPlayers}</span>
            <button onClick={incrementPlayers} className="w-12 h-12 flex items-center justify-center bg-indigo-600 rounded-xl text-white hover:bg-indigo-500 transition">+</button>
          </div>
        </div>

        {/* Player Names Input Grid */}
        <div className="space-y-3 animate-fade-in">
          <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Nombres de Jugadores</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {playerNames.map((name, index) => (
              <div key={index} className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder={`Jugador ${index + 1}`}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-10 pr-3 text-white text-sm focus:border-indigo-500 outline-none transition-colors"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Impostor Count */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Impostores</label>
          <div className="flex items-center justify-between bg-slate-800 p-2 rounded-2xl border border-slate-700">
            <button onClick={decrementImpostors} className="w-12 h-12 flex items-center justify-center bg-slate-700 rounded-xl text-white hover:bg-slate-600 transition">-</button>
            <span className="text-2xl font-bold text-rose-500">{impostorCount}</span>
            <button onClick={incrementImpostors} className="w-12 h-12 flex items-center justify-center bg-rose-600 rounded-xl text-white hover:bg-rose-500 transition">+</button>
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Categoría</label>
          <select 
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
            <option value="custom">+ Crear Personalizada</option>
          </select>
        </div>

        {/* Custom Category Fields */}
        {isCustom && (
          <div className="space-y-4 pt-4 border-t border-slate-800 animate-fade-in">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Nombre Categoría</label>
              <input
                type="text"
                placeholder="Ej. Mis Amigos"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Palabras (separadas por comas)</label>
              <textarea
                placeholder="Juan, Pedro, María, Sofía..."
                value={customWords}
                onChange={(e) => setCustomWords(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white h-24 focus:border-indigo-500 outline-none resize-none"
              />
            </div>
          </div>
        )}

        <Button onClick={handleStart} fullWidth disabled={isCustom && (!customName || !customWords)}>
          Iniciar Partida
        </Button>
      </Card>
    </div>
  );
};
