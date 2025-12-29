
import React, { useState, useEffect } from 'react';
import { Settings, X, ShieldCheck, Lock, Check, UserPlus, Zap } from 'lucide-react';
import { HomeScreen } from './components/HomeScreen';
import { SetupScreen } from './components/SetupScreen';
import { RoleRevealScreen } from './components/RoleRevealScreen';
import { GameScreen } from './components/GameScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { Button } from './components/Button';
import { GameStep, GameConfig, Player, WordItem, Role } from './types';
import { CATEGORIES } from './constants';

const STORAGE_KEY = 'impostor_game_config_v1';
const MASTER_KEY = '2729';

// Fisher-Yates shuffle algorithm to randomize an array
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const App: React.FC = () => {
  const [gameStep, setGameStep] = useState<GameStep>(GameStep.HOME);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');
  const [revealIndex, setRevealIndex] = useState(0);
  
  const [lastConfig, setLastConfig] = useState<GameConfig | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Error loading saved config", e);
      return null;
    }
  });
  
  const [isHintsMode, setIsHintsMode] = useState(false);
  const [impostorsKnowEachOther, setImpostorsKnowEachOther] = useState(false);

  // Settings Modal State
  const [showSettings, setShowSettings] = useState(false);
  const [settingsPassword, setSettingsPassword] = useState('');
  const [isSettingsUnlocked, setIsSettingsUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  
  // Master Mechanics State
  const [manualImpostorEnabled, setManualImpostorEnabled] = useState(false);
  const [manualImpostorIndices, setManualImpostorIndices] = useState<number[]>([]);
  const [chaosModeEnabled, setChaosModeEnabled] = useState(false);

  const handleSettingsAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (settingsPassword === MASTER_KEY) {
      setIsSettingsUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setSettingsPassword('');
    }
  };

  const closeSettings = () => {
    setShowSettings(false);
    setSettingsPassword('');
    setPasswordError(false);
  };

  const toggleManualImpostor = (idx: number) => {
    const maxImpostors = lastConfig?.impostorCount || 1;
    setManualImpostorIndices(prev => {
      if (prev.includes(idx)) {
        return prev.filter(i => i !== idx);
      }
      if (prev.length < maxImpostors) {
        return [...prev, idx];
      }
      return [...prev.slice(1), idx];
    });
  };

  const startGame = (config: GameConfig) => {
    const allAvailableItems: { item: WordItem, categoryName: string }[] = [];
    const uniqueCategoryIds = Array.from(new Set(config.selectedCategoryIds));

    uniqueCategoryIds.forEach(id => {
      if (id === 'custom') {
        if (config.customCategoryWords.length > 0) {
          const words = config.customCategoryWords.split(',').map(w => w.trim()).filter(w => w.length > 0);
          words.forEach(w => {
            allAvailableItems.push({
              item: { target: w, hint: 'Improvisa' },
              categoryName: config.customCategoryName || 'Personalizada'
            });
          });
        }
        return;
      }
      const cat = CATEGORIES.find(c => c.id === id);
      if (cat) {
        cat.items.forEach(item => {
          allAvailableItems.push({ item, categoryName: cat.name });
        });
      }
    });

    if (allAvailableItems.length === 0) return;

    const shuffledPool = shuffle(allAvailableItems);
    
    setLastConfig(config);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error("Error saving config", e);
    }

    setIsHintsMode(config.hintsEnabled);
    setImpostorsKnowEachOther(config.impostorsKnowEachOther);

    // Initial Role Assignment
    const finalRoles: Role[] = new Array(config.totalPlayers).fill('CIVILIAN');
    let impostorsToAssign = config.impostorCount;

    if (manualImpostorEnabled && manualImpostorIndices.length > 0) {
      manualImpostorIndices.forEach(idx => {
        if (idx < config.totalPlayers && impostorsToAssign > 0) {
          finalRoles[idx] = 'IMPOSTOR';
          impostorsToAssign--;
        }
      });
    }

    const availableSlots = Array.from({ length: config.totalPlayers }, (_, i) => i)
      .filter(i => finalRoles[i] !== 'IMPOSTOR');
    
    const shuffledSlots = shuffle(availableSlots);
    for (let i = 0; i < impostorsToAssign; i++) {
      if (shuffledSlots[i] !== undefined) {
        finalRoles[shuffledSlots[i]] = 'IMPOSTOR';
      }
    }

    // Word Assignment
    const secretWord = shuffledPool[0].item.target;
    const hintWord = shuffledPool[0].item.hint;
    setCurrentWord(chaosModeEnabled ? 'MODO CAOS' : secretWord);
    setCategoryName(shuffledPool[0].categoryName);

    const newPlayers: Player[] = config.playerNames.map((playerName, i) => {
      const assignedRole = finalRoles[i];
      let playerWord: string | undefined;

      if (chaosModeEnabled) {
        playerWord = shuffledPool[i % shuffledPool.length].item.target;
      } else {
        playerWord = assignedRole === 'CIVILIAN' ? secretWord : (config.hintsEnabled ? hintWord : undefined);
      }

      return {
        id: i,
        name: playerName,
        role: assignedRole,
        word: playerWord
      };
    });

    if (config.impostorsKnowEachOther) {
      const impostorNames = newPlayers
        .filter(p => p.role === 'IMPOSTOR')
        .map(p => p.name);

      if (impostorNames.length > 1) {
        newPlayers.forEach(p => {
          if (p.role === 'IMPOSTOR') {
            p.otherImpostors = impostorNames.filter(name => name !== p.name);
          }
        });
      }
    }

    setPlayers(newPlayers);
    setRevealIndex(0);
    setGameStep(GameStep.REVEAL_ROLES);
  };

  const handleNextReveal = () => {
    if (revealIndex < players.length - 1) {
      setRevealIndex(prev => prev + 1);
    } else {
      setGameStep(GameStep.PLAYING);
    }
  };

  const handleReset = () => {
    setGameStep(GameStep.SETUP);
    setPlayers([]);
    setCurrentWord('');
    setRevealIndex(0);
  };

  const renderScreen = () => {
    switch (gameStep) {
      case GameStep.HOME:
        return <HomeScreen onCreateGame={() => setGameStep(GameStep.SETUP)} />;
      case GameStep.SETUP:
        return (
          <SetupScreen 
            onStartGame={startGame} 
            onBack={() => setGameStep(GameStep.HOME)} 
            lastConfig={lastConfig}
          />
        );
      case GameStep.REVEAL_ROLES:
        return (
          <RoleRevealScreen 
            player={players[revealIndex]} 
            playerIndex={revealIndex}
            totalPlayers={players.length}
            onNext={handleNextReveal}
            hintsEnabled={isHintsMode}
            impostorsKnowEachOther={impostorsKnowEachOther}
          />
        );
      case GameStep.PLAYING:
        return (
          <GameScreen 
            onEndGame={() => setGameStep(GameStep.SUMMARY)} 
            categoryName={categoryName}
            players={players}
          />
        );
      case GameStep.SUMMARY:
        return (
          <SummaryScreen 
            players={players} 
            word={currentWord} 
            onReset={handleReset} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black z-0 pointer-events-none"></div>
      <div className="fixed inset-0 bg-grid-pattern z-0 pointer-events-none opacity-40"></div>
      
      <button 
        onClick={() => setShowSettings(true)}
        className="fixed top-6 right-6 z-[100] p-3 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-300 shadow-lg active:scale-95 group"
      >
        <Settings size={24} className={`group-hover:rotate-90 transition-transform duration-500 ${manualImpostorEnabled || chaosModeEnabled ? "text-indigo-400" : ""}`} />
      </button>

      <div className="relative z-10">
        {renderScreen()}
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={closeSettings} />
          
          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>

            <button 
              onClick={closeSettings}
              className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {!isSettingsUnlocked ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                    <Lock size={32} className="text-indigo-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Acceso Maestro</h3>
                  <p className="text-slate-400 text-sm">Ingresa el código de seguridad para configurar la partida.</p>
                </div>

                <form onSubmit={handleSettingsAccess} className="space-y-4">
                  <input 
                    type="password" 
                    inputMode="numeric"
                    placeholder="••••"
                    value={settingsPassword}
                    onChange={(e) => setSettingsPassword(e.target.value)}
                    className={`w-full bg-black/40 border ${passwordError ? 'border-rose-500' : 'border-slate-700'} rounded-2xl px-4 py-4 text-center text-4xl font-black tracking-[0.5em] text-white focus:border-indigo-500 outline-none transition-all shadow-inner`}
                    autoFocus
                  />
                  {passwordError && (
                    <div className="bg-rose-500/10 border border-rose-500/20 p-2 rounded-xl">
                      <p className="text-rose-500 text-center text-xs font-bold uppercase">Código de acceso incorrecto</p>
                    </div>
                  )}
                  <Button type="submit" fullWidth>Desbloquear Panel</Button>
                </form>
              </div>
            ) : (
              <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <ShieldCheck size={24} className="text-indigo-400" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">Configuración Maestra</h3>
                </div>

                <div className="space-y-4">
                  {/* Manual Impostor */}
                  <div 
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${manualImpostorEnabled ? 'bg-indigo-600/10 border-indigo-500/30' : 'bg-white/5 border-white/5'}`}
                    onClick={() => setManualImpostorEnabled(!manualImpostorEnabled)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl ${manualImpostorEnabled ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                        <UserPlus size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">Modo Rigged</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Impostor Manual</p>
                      </div>
                    </div>
                    <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${manualImpostorEnabled ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-slate-700'}`}>
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${manualImpostorEnabled ? 'left-7' : 'left-1'}`} />
                    </div>
                  </div>

                  {manualImpostorEnabled && (
                    <div className="space-y-3 animate-fade-in pl-2">
                      <div className="flex items-center justify-between px-1">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Elegir Infiltrados</p>
                        <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20">
                          {manualImpostorIndices.length} / {lastConfig?.impostorCount || 1}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {Array.from({ length: lastConfig?.totalPlayers || 4 }).map((_, idx) => {
                          const playerName = lastConfig?.playerNames[idx] || `Jugador ${idx + 1}`;
                          const isSelected = manualImpostorIndices.includes(idx);
                          return (
                            <button
                              key={idx}
                              onClick={(e) => { e.stopPropagation(); toggleManualImpostor(idx); }}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                isSelected 
                                ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                                : 'bg-black/20 border-slate-700/50 text-slate-400'
                              }`}
                            >
                              <span className="text-sm font-bold">{playerName}</span>
                              {isSelected && <Check size={16} className="text-indigo-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Chaos Mode */}
                  <div 
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${chaosModeEnabled ? 'bg-amber-600/10 border-amber-500/30' : 'bg-white/5 border-white/5'}`}
                    onClick={() => setChaosModeEnabled(!chaosModeEnabled)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl ${chaosModeEnabled ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-500'}`}>
                        <Zap size={20} fill={chaosModeEnabled ? "currentColor" : "none"} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-200">Modo Caos</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Palabras Distintas</p>
                      </div>
                    </div>
                    <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${chaosModeEnabled ? 'bg-amber-500 shadow-lg shadow-amber-500/20' : 'bg-slate-700'}`}>
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${chaosModeEnabled ? 'left-7' : 'left-1'}`} />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                   <Button onClick={closeSettings} fullWidth variant="secondary">Cerrar</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
