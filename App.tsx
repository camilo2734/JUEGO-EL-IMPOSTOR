import React, { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { SetupScreen } from './components/SetupScreen';
import { RoleRevealScreen } from './components/RoleRevealScreen';
import { GameScreen } from './components/GameScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { GameStep, GameConfig, Player } from './types';
import { CATEGORIES } from './constants';

const App: React.FC = () => {
  const [gameStep, setGameStep] = useState<GameStep>(GameStep.HOME);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [categoryName, setCategoryName] = useState<string>('');
  const [revealIndex, setRevealIndex] = useState(0);

  const startGame = (config: GameConfig) => {
    let words: string[] = [];
    let name = '';

    // Handle Category Selection
    if (config.selectedCategoryId === 'custom') {
      words = config.customCategoryWords.split(',').map(w => w.trim()).filter(w => w.length > 0);
      name = config.customCategoryName || 'Personalizada';
    } else {
      const category = CATEGORIES.find(c => c.id === config.selectedCategoryId);
      if (category) {
        words = category.words;
        name = category.name;
      }
    }

    if (words.length === 0) return;

    // Select random word
    const secretWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(secretWord);
    setCategoryName(name);

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
        delete newPlayers[randomIndex].word;
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
    setGameStep(GameStep.HOME);
    setPlayers([]);
    setCurrentWord('');
    setRevealIndex(0);
  };

  const renderScreen = () => {
    switch (gameStep) {
      case GameStep.HOME:
        return <HomeScreen onCreateGame={() => setGameStep(GameStep.SETUP)} />;
      case GameStep.SETUP:
        return <SetupScreen onStartGame={startGame} onBack={() => setGameStep(GameStep.HOME)} />;
      case GameStep.REVEAL_ROLES:
        return (
          <RoleRevealScreen 
            player={players[revealIndex]} 
            playerIndex={revealIndex}
            totalPlayers={players.length}
            onNext={handleNextReveal}
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
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-indigo-500/30">
      {renderScreen()}
    </div>
  );
};

export default App;
