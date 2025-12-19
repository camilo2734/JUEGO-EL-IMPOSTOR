
import React, { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { SetupScreen } from './components/SetupScreen';
import { RoleRevealScreen } from './components/RoleRevealScreen';
import { GameScreen } from './components/GameScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { GameStep, GameConfig, Player, WordItem, Role } from './types';
import { CATEGORIES } from './constants';

const STORAGE_KEY = 'impostor_game_config_v1';

/**
 * Algoritmo Fisher-Yates para garantizar aleatoriedad pura sin sesgos estadísticos.
 * Crea una copia del array para no mutar el original.
 */
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

  const startGame = (config: GameConfig) => {
    // 1. Consolidación y Aleatorización del Pool de Palabras
    const allAvailableItems: { item: WordItem, categoryName: string }[] = [];
    
    // Deduplicamos las categorías para evitar sesgos si una ID se repite en la config
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
          allAvailableItems.push({
            item: item,
            categoryName: cat.name
          });
        });
      }
    });

    if (allAvailableItems.length === 0) return;

    // Barajamos el pool antes de elegir para máxima entropía
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

    // 2. Asignación Robusta de Roles
    // Generamos la lista exacta de roles y la barajamos
    const rolePool: Role[] = new Array(config.totalPlayers).fill('CIVILIAN' as Role);
    for (let i = 0; i < config.impostorCount; i++) {
      rolePool[i] = 'IMPOSTOR';
    }
    
    const shuffledRoles = shuffleArray(rolePool);

    // Mapeamos los nombres a los roles ya barajados
    const newPlayers: Player[] = config.playerNames.map((playerName, i) => {
      const assignedRole = shuffledRoles[i];
      const player: Player = {
        id: i,
        name: playerName,
        role: assignedRole,
        word: assignedRole === 'CIVILIAN' ? secretWord : (config.hintsEnabled ? hintWord : undefined)
      };
      return player;
    });

    // 3. Lógica de Impostores aliados
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
      {/* Background Dinámico */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black z-0 pointer-events-none"></div>
      <div className="fixed inset-0 bg-grid-pattern z-0 pointer-events-none opacity-40"></div>
      
      {/* Contenido Principal */}
      <div className="relative z-10">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;
