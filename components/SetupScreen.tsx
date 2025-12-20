
import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Users, Check, Lightbulb, Settings, Lock, Unlock, X, Eye, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { CATEGORIES } from '../constants';
import { GameConfig } from '../types';

interface SetupScreenProps {
  onStartGame: (config: GameConfig) => void;
  onBack: () => void;
  lastConfig: GameConfig | null;
}

const UNLOCKED_STORAGE_KEY = 'impostor_unlocked_categories_v1';

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame, onBack, lastConfig }) => {
  const [totalPlayers, setTotalPlayers] = useState(lastConfig?.totalPlayers ?? 4);
  const [impostorCount, setImpostorCount] = useState(lastConfig?.impostorCount ?? 1);
  
  const [hintsEnabled, setHintsEnabled] = useState(lastConfig?.hintsEnabled ?? false);
  const [impostorsKnowEachOther, setImpostorsKnowEachOther] = useState(lastConfig?.impostorsKnowEachOther ?? false);
  
  const [customName, setCustomName] = useState(lastConfig?.customCategoryName ?? '');
  const [customWords, setCustomWords] = useState(lastConfig?.customCategoryWords ?? '');
  const [playerNames, setPlayerNames] = useState<string[]>(lastConfig?.playerNames ?? []);

  // Locking Logic
  const getSavedUnlocked = (): string[] => {
    try {
      const saved = localStorage.getItem(UNLOCKED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error loading unlocked categories", e);
      return [];
    }
  };

  const [unlockedCategories, setUnlockedCategories] = useState<string[]>(getSavedUnlocked);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [categoryToUnlock, setCategoryToUnlock] = useState<string | null>(null);
  const [unlockCode, setUnlockCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Initialize selected categories
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(() => {
    const defaultId = CATEGORIES.find(c => !c.isLocked)?.id || CATEGORIES[0].id;
    const saved = lastConfig?.selectedCategoryIds;
    if (!saved || saved.length === 0) return [defaultId];
    const currentUnlocked = getSavedUnlocked();
    const validIds = saved.filter(id => {
      if (id === 'custom') return true;
      const cat = CATEGORIES.find(c => c.id === id);
      return cat && (!cat.isLocked || currentUnlocked.includes(id));
    });
    return validIds.length > 0 ? validIds : [defaultId];
  });

  useEffect(() => {
    setPlayerNames(prev => {
      const newNames = [...prev];
      if (totalPlayers > prev.length) {
        for (let i = prev.length; i < totalPlayers; i++) {
          newNames.push('');
        }
      } else if (totalPlayers < prev.length) {
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

  const handleRemovePlayer = (index: number) => {
    if (totalPlayers <= 3) return; // Mínimo 3 jugadores
    
    const newNames = playerNames.filter((_, i) => i !== index);
    const newTotal = totalPlayers - 1;
    
    setPlayerNames(newNames);
    setTotalPlayers(newTotal);
    
    // Ajustar impostores si es necesario
    if (impostorCount >= newTotal) {
      setImpostorCount(newTotal - 1);
    }
  };

  const toggleCategory = (id: string) => {
    const category = CATEGORIES.find(c => c.id === id);
    if (category?.isLocked && !unlockedCategories.includes(id)) {
      setCategoryToUnlock(id);
      setUnlockCode('');
      setErrorMsg('');
      setShowUnlockModal(true);
      return;
    }

    setSelectedCategoryIds(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter(catId => catId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockCode === '2711') {
      if (categoryToUnlock) {
        const newUnlockedList = [...unlockedCategories, categoryToUnlock];
        setUnlockedCategories(newUnlockedList);
        try {
          localStorage.setItem(UNLOCKED_STORAGE_KEY, JSON.stringify(newUnlockedList));
        } catch (e) {
          console.error("Error saving unlocked categories", e);
        }
        setSelectedCategoryIds(prev => [...prev, categoryToUnlock]);
      }
      setShowUnlockModal(false);
      setCategoryToUnlock(null);
    } else {
      setErrorMsg('Código incorrecto');
    }
  };

  const isCustomSelected = selectedCategoryIds.includes('custom');

  const handleStart = () => {
    const safeSelectedIds = selectedCategoryIds.filter(id => {
       if (id === 'custom') return true;
       const cat = CATEGORIES.find(c => c.id === id);
       return cat && (!cat.isLocked || unlockedCategories.includes(id));
    });

    const finalSelectedIds = safeSelectedIds.length > 0 
        ? safeSelectedIds 
        : [CATEGORIES.find(c => !c.isLocked)?.id || CATEGORIES[0].id];

    const finalNames = playerNames.map((name, index) => 
      name.trim() === '' ? `Jugador ${index + 1}` : name.trim()
    );

    onStartGame({
      totalPlayers,
      impostorCount,
      selectedCategoryIds: finalSelectedIds,
      hintsEnabled,
      impostorsKnowEachOther,
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
    <div className="min-h-screen p-4 flex flex-col items-center">
      <Card className="space-y-8 w-full max-w-lg my-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Settings size={20} className="text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">CONFIGURACIÓN</h2>
          </div>
          <div className="w-8"></div>
        </div>

        {/* Player Count */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Jugadores</label>
            <span className="text-xs text-indigo-400 font-semibold">{totalPlayers} activos</span>
          </div>
          <div className="flex items-center justify-between bg-black/40 p-1.5 rounded-2xl border border-white/10">
            <button onClick={decrementPlayers} className="w-14 h-12 flex items-center justify-center bg-white/5 rounded-xl text-white hover:bg-white/10 transition active:scale-95 text-xl font-medium">-</button>
            <span className="text-3xl font-black text-white">{totalPlayers}</span>
            <button onClick={incrementPlayers} className="w-14 h-12 flex items-center justify-center bg-indigo-600 rounded-xl text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition active:scale-95 text-xl font-medium">+</button>
          </div>
        </div>

        {/* Player Names Input Grid */}
        <div className="space-y-4 animate-fade-in">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nombres</label>
          <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {playerNames.map((name, index) => (
              <div key={index} className="flex items-center gap-2 group">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    placeholder={`Jugador ${index + 1}`}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl py-3 pl-10 pr-3 text-white text-sm focus:border-indigo-500/50 focus:bg-slate-800 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all"
                  />
                </div>
                {totalPlayers > 3 && (
                  <button 
                    onClick={() => handleRemovePlayer(index)}
                    className="p-3 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
                    title="Eliminar jugador"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Impostor Count */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Impostores</label>
          <div className="flex items-center justify-between bg-black/40 p-1.5 rounded-2xl border border-white/10">
            <button onClick={decrementImpostors} className="w-14 h-12 flex items-center justify-center bg-white/5 rounded-xl text-white hover:bg-white/10 transition active:scale-95 text-xl font-medium">-</button>
            <span className="text-3xl font-black text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">{impostorCount}</span>
            <button onClick={incrementImpostors} className="w-14 h-12 flex items-center justify-center bg-rose-600 rounded-xl text-white hover:bg-rose-500 shadow-lg shadow-rose-500/20 transition active:scale-95 text-xl font-medium">+</button>
          </div>
        </div>

        {/* Toggles Container */}
        <div className="space-y-3">
          <div 
            className={`relative overflow-hidden p-4 rounded-xl border transition-all cursor-pointer group ${hintsEnabled ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600'}`} 
            onClick={() => setHintsEnabled(!hintsEnabled)}
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full transition-colors ${hintsEnabled ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-slate-700/50 text-slate-400'}`}>
                  <Lightbulb size={20} fill={hintsEnabled ? "currentColor" : "none"} />
                </div>
                <div>
                  <p className={`font-bold transition-colors ${hintsEnabled ? 'text-amber-200' : 'text-slate-300'}`}>Modo Pistas</p>
                  <p className="text-xs text-slate-500 mt-0.5">Ayuda al impostor con una palabra clave</p>
                </div>
              </div>
              <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${hintsEnabled ? 'bg-amber-500' : 'bg-slate-700'}`}>
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${hintsEnabled ? 'left-7' : 'left-1'}`} />
              </div>
            </div>
          </div>

          <div 
            className={`relative overflow-hidden p-4 rounded-xl border transition-all cursor-pointer group ${impostorsKnowEachOther ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600'}`} 
            onClick={() => setImpostorsKnowEachOther(!impostorsKnowEachOther)}
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full transition-colors ${impostorsKnowEachOther ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-700/50 text-slate-400'}`}>
                  <Users size={20} fill={impostorsKnowEachOther ? "currentColor" : "none"} />
                </div>
                <div>
                  <p className={`font-bold transition-colors ${impostorsKnowEachOther ? 'text-indigo-200' : 'text-slate-300'}`}>Los impostores se conocen</p>
                  <p className="text-xs text-slate-500 mt-0.5">Revela a los aliados entre sí</p>
                </div>
              </div>
              <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${impostorsKnowEachOther ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${impostorsKnowEachOther ? 'left-7' : 'left-1'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Categorías</label>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map(cat => {
              const isLocked = cat.isLocked && !unlockedCategories.includes(cat.id);
              const isSelected = selectedCategoryIds.includes(cat.id);
              
              return (
                <button 
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`relative p-3 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between overflow-hidden group ${
                    isSelected 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/30' 
                      : isLocked 
                        ? 'bg-slate-900/60 border-rose-500/30 text-rose-300/60'
                        : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {cat.name}
                  </span>
                  {isLocked ? (
                    <Lock size={16} className="text-rose-400 relative z-10" />
                  ) : (
                    <>
                      {isSelected && <Check size={16} className="text-white relative z-10" />}
                      {isSelected && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-100" />}
                    </>
                  )}
                </button>
              );
            })}
            <button 
              onClick={() => toggleCategory('custom')}
              className={`relative p-3 rounded-xl border text-sm font-semibold transition-all text-left flex items-center justify-between overflow-hidden ${
                selectedCategoryIds.includes('custom')
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/30' 
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
               <span className="relative z-10">Personalizada</span>
               {selectedCategoryIds.includes('custom') && <Check size={16} className="relative z-10" />}
            </button>
          </div>
        </div>

        {/* Custom Category Fields */}
        {isCustomSelected && (
          <div className="space-y-4 pt-6 border-t border-white/5 animate-fade-in bg-black/20 -mx-8 px-8 pb-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-2 block uppercase">Nombre de Categoría</label>
              <input
                type="text"
                placeholder="Ej. Mis Amigos"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-2 block uppercase">Palabras (separadas por comas)</label>
              <textarea
                placeholder="Juan, Pedro, María, Sofía..."
                value={customWords}
                onChange={(e) => setCustomWords(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white h-24 focus:border-indigo-500 outline-none resize-none"
              />
            </div>
          </div>
        )}

        <Button onClick={handleStart} fullWidth disabled={isCustomSelected && (!customName || !customWords)} className="mt-4">
          Comenzar Partida
        </Button>
      </Card>

      {/* Unlock Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowUnlockModal(false)} />
          <div className="relative bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl w-full max-w-sm animate-fade-in">
            <button 
              onClick={() => setShowUnlockModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                <Lock size={32} className="text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Categoría Bloqueada</h3>
              <p className="text-slate-400 text-sm">Ingresa el código de seguridad para acceder a este contenido.</p>
            </div>

            <form onSubmit={handleUnlockSubmit} className="space-y-4">
              <div>
                <input 
                  type="password" 
                  inputMode="numeric"
                  placeholder="Código de acceso"
                  value={unlockCode}
                  onChange={(e) => setUnlockCode(e.target.value)}
                  className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-widest text-white focus:border-rose-500 outline-none transition-all placeholder:text-slate-700 placeholder:text-sm placeholder:tracking-normal placeholder:font-normal"
                  autoFocus
                />
                {errorMsg && <p className="text-rose-500 text-xs text-center mt-2 font-bold">{errorMsg}</p>}
              </div>
              
              <Button type="submit" fullWidth variant="danger">
                Desbloquear
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
