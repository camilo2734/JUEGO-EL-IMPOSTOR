import React, { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { SetupScreen } from './components/SetupScreen';
import { RoleRevealScreen } from './components/RoleRevealScreen';
import { GameScreen } from './components/GameScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { GameStep, GameConfig, Player, WordItem } from './types';
import { CATEGORIES } from './constants';

const App: React.FC = () => {
  const [gameStep, setGameStep] = useState<GameStep>(GameStep.HOME);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');
  const [revealIndex, setRevealIndex] = useState(0);
  const [lastPlayerNames, setLastPlayerNames] = useState<string[]>([]);
  const [isHintsMode, setIsHintsMode] = useState(false);

  const startGame = (config: GameConfig) => {
    // 1. Resolve selected categories into a list of items
    const activePools: { name: string, items: WordItem[] }[] = [];

    // Add standard categories
    config.selectedCategoryIds.forEach(id => {
      if (id === 'custom') return;
      const cat = CATEGORIES.find(c => c.id === id);
      if (cat) activePools.push({ 
        name: cat.name, 
        items: cat.items
      });
    });

    // Add custom category if selected
    if (config.selectedCategoryIds.includes('custom') && config.customCategoryWords.length > 0) {
      const words = config.customCategoryWords.split(',').map(w => w.trim()).filter(w => w.length > 0);
      if (words.length > 0) {
        // For custom categories, we can't generate descriptive hints easily.
        // We'll use a generic fallback.
        const customItems: WordItem[] = words.map(w => ({
          target: w,
          hint: 'Improvisa' 
        }));
        
        activePools.push({ 
          name: config.customCategoryName || 'Personalizada', 
          items: customItems
        });
      }
    }

    if (activePools.length === 0) return;

    // 2. Pick a random pool
    const selectedPool = activePools[Math.floor(Math.random() * activePools.length)];
    
    // 3. Pick a random item (Target + Hint)
    const selectedItem = selectedPool.items[Math.floor(Math.random() * selectedPool.items.length)];
    const secretWord = selectedItem.target;
    const hintWord = selectedItem.hint;

    setCurrentWord(secretWord);
    setCategoryName(selectedPool.name); 
    setLastPlayerNames(config.playerNames);
    setIsHintsMode(config.hintsEnabled);

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
      const randomIndex = Math.floor(Math.random() * config.totalPlayers);
      if (newPlayers[randomIndex].role === 'CIVILIAN') {
        newPlayers[randomIndex].role = 'IMPOSTOR';
        
        // If hints enabled, give them the descriptive hint
        if (config.hintsEnabled) {
          newPlayers[randomIndex].word = hintWord;
        } else {
          delete newPlayers[randomIndex].word;
        }
        impostorsAssigned++;
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
            initialPlayerNames={lastPlayerNames}
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
          />
        );
      case GameStep.PLAYING:
        return (
          <GameScreen 
            onEndGame={() => setGameStep(GameStep.SUMMARY)} 
            categoryName={categoryName}
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