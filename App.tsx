
import React, { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { SetupScreen } from './components/SetupScreen';
import { RoleRevealScreen } from './components/RoleRevealScreen';
import { GameScreen } from './components/GameScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { GameStep, GameConfig, Player, WordItem } from './types';
import { CATEGORIES } from './constants';

const STORAGE_KEY = 'impostor_game_config_v1';

const App: React.FC = () => {
  const [gameStep, setGameStep] = useState<GameStep>(GameStep.HOME);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');
  const [revealIndex, setRevealIndex] = useState(0);
  
  // Initialize config from LocalStorage if available so custom categories persist
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
    // 1. Resolve all selected categories into a single flattened list of possible items
    // This ensures every single word has an equal probability of being chosen (1/total_words)
    const allAvailableItems: { item: WordItem, categoryName: string }[] = [];

    config.selectedCategoryIds.forEach(id => {
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

    // 2. Pick a random item from the entire combined pool (True randomness)
    const randomIndex = Math.floor(Math.random() * allAvailableItems.length);
    const selected = allAvailableItems[randomIndex];
    
    const secretWord = selected.item.target;
    const hintWord = selected.item.hint;

    setCurrentWord(secretWord);
    setCategoryName(selected.categoryName); 
    
    // Save config to state and LocalStorage to persist custom categories
    setLastConfig(config);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error("Error saving config", e);
    }

    setIsHintsMode(config.hintsEnabled);
    setImpostorsKnowEachOther(config.impostorsKnowEachOther);

    // Create Players with names
    const newPlayers: Player[] = config.playerNames.map((playerName, i) => ({
      id: i,
      name: playerName,
      role: 'CIVILIAN',
      word: secretWord
    }));

    // Assign Impostors randomly
    let impostorsAssigned = 0;
    while (impostorsAssigned < config.impostorCount) {
      const rIndex = Math.floor(Math.random() * config.totalPlayers);
      if (newPlayers[rIndex].role === 'CIVILIAN') {
        newPlayers[rIndex].role = 'IMPOSTOR';
        
        // If hints enabled, give them the descriptive hint
        if (config.hintsEnabled) {
          newPlayers[rIndex].word = hintWord;
        } else {
          delete newPlayers[rIndex].word;
        }
        impostorsAssigned++;
      }
    }

    // Logic for "Impostors know each other"
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
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black z-0 pointer-events-none"></div>
      <div className="fixed inset-0 bg-grid-pattern z-0 pointer-events-none opacity-40"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;
