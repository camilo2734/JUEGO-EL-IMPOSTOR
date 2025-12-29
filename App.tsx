
import React, { useState, useEffect } from 'react';
import { Settings, X, ShieldCheck, Lock, Check } from 'lucide-react';
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

function shuffleArray<T>(array: T[]): T[] {
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
  
  const [manualImpostorEnabled, setManualImpostorEnabled] = useState(false);
  const [manualImpostorIndex, setManualImpostorIndex] = useState<number | null>(null);

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
    // We don't reset isSettingsUnlocked so they don't have to re-enter it every time during a session
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

    const shuffledPool = shuffleArray(allAvailableItems);
    const selected = shuffledPool[Math.floor(Math.random() * shuffledPool.length)];
    const secretWord = selected.item.target;
    const hintWord = selected.item.hint;

    setCurrentWord(secretWord);
    setCategoryName(selected.categoryName); 
    
    setLastConfig(config);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error("Error saving config", e);
    }

    setIsHintsMode(config.hintsEnabled);
    setImpostorsKnowEachOther(config.impostorsKnowEachOther);

    // Role Assignment Logic
    const finalRoles: Role[] = new Array(config.totalPlayers).fill('CIVILIAN');
    let impostorsToAssign = config.impostorCount;

    // Handle Manual Override
    if (manualImpostorEnabled && manualImpostorIndex !== null && manualImpostorIndex < config.totalPlayers) {
      finalRoles[manualImpostorIndex] = 'IMPOSTOR';
      impostorsToAssign--;
    }

    // Assign remaining impostors randomly to available slots
    const availableSlots = Array.from({ length: config.totalPlayers }, (_, i) => i)
      .filter(i => finalRoles[i] !== 'IMPOSTOR');
    
    const shuffledSlots = shuffleArray(availableSlots);
    for (let i = 0; i < impostorsToAssign; i++) {
      if (shuffledSlots[i] !== undefined) {
        finalRoles[shuffledSlots[i]] = 'IMPOSTOR';
      }
    }

    const newPlayers: Player[] = config.playerNames.map((playerName, i) => {
      const assignedRole = finalRoles[i];
      return {
        id: i,
        name: playerName,
        role: assignedRole,
        word: assignedRole === 'CIVILIAN' ? secretWord : (config.hintsEnabled ? hintWord : undefined)
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
      
      {/* Settings Button */}
      <button 
        onClick={() => setShowSettings(true)}
        className="fixed top-6 right-6 z-50 p-3 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-300 shadow-lg active:scale-95"
      >
        <Settings size={24} className={manualImpostorEnabled ? "text-indigo-400" : ""} />
      </button>

      {/* Main Content */}
      <div className="relative z-10">
        {renderScreen()}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={closeSettings} />
          
          <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in">
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
                    className={`w-full bg-black/40 border ${passwordError ? 'border-rose-500' : 'border-slate-700'} rounded-2xl px-4 py-4 text-center text-4xl font-black tracking-[0.5em] text-white focus:border-indigo-500 outline-none transition-all`}
                    autoFocus
                  />
                  {passwordError && <p className="text-rose-500 text-center text-xs font-bold uppercase">Código Incorrecto</p>}
                  <Button type="submit" fullWidth>Desbloquear</Button>
                </form>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <ShieldCheck size={24} className="text-indigo-400" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">Configuración Maestra</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <p className="font-bold text-slate-200">Modo Rigged</p>
                      <p className="text-xs text-slate-500">Seleccionar impostor manualmente</p>
                    </div>
                    <button 
                      onClick={() => setManualImpostorEnabled(!manualImpostorEnabled)}
                      className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${manualImpostorEnabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${manualImpostorEnabled ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>

                  {manualImpostorEnabled && (
                    <div className="space-y-3 animate-fade-in">
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Elegir Infiltrado</p>
                      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {Array.from({ length: lastConfig?.totalPlayers || 4 }).map((_, idx) => {
                          const playerName = lastConfig?.playerNames[idx] || `Jugador ${idx + 1}`;
                          const isSelected = manualImpostorIndex === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() => setManualImpostorIndex(idx)}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                isSelected 
                                ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                                : 'bg-black/20 border-slate-700/50 text-slate-400 hover:bg-black/40'
                              }`}
                            >
                              <span className="font-bold">{playerName}</span>
                              {isSelected && <Check size={18} className="text-indigo-400" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <Button onClick={closeSettings} fullWidth variant="secondary">Cerrar</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
