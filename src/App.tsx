import React, { useState, useEffect } from 'react';
import { GameStage, GameState } from './types';
import { sound } from './utils/audio';
import { HUD } from './components/HUD';
import { IntroScreen } from './components/IntroScreen';
import { Quest1Code } from './components/Quest1Code';
import { Quest2Coin } from './components/Quest2Coin';
import { Quest3Mine } from './components/Quest3Mine';
import { Quest4Core } from './components/Quest4Core';
import { CinematicTransition } from './components/CinematicTransition';
import { ScrollAnimationScreen } from './components/ScrollAnimationScreen';
import { RevealScreen } from './components/RevealScreen';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    stage: 'intro',
    xp: 0,
    maxStageXp: 500,
    hearts: 5,
    soundEnabled: true,
    startTime: Date.now(),
    elapsedSeconds: 0,
    cluesInspected: {
      tablet: false,
      chest: false,
      torch: false,
    },
    coinFound: false,
    blockBroken: false,
    buttonChaseCount: 0,
  });

  // Track active playtime
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (
      gameState.stage !== 'intro' &&
      gameState.stage !== 'reveal' &&
      gameState.stage !== 'scroll_animation' &&
      gameState.stage !== 'cinematic'
    ) {
      interval = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          elapsedSeconds: Math.floor((Date.now() - prev.startTime) / 1000),
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.stage]);

  const handleToggleSound = () => {
    const nextVal = !gameState.soundEnabled;
    sound.setEnabled(nextVal);
    setGameState((prev) => ({ ...prev, soundEnabled: nextVal }));
  };

  const handleRestart = () => {
    sound.playClick();
    sound.stopMusic();
    setGameState({
      stage: 'intro',
      xp: 0,
      maxStageXp: 500,
      hearts: 5,
      soundEnabled: gameState.soundEnabled,
      startTime: Date.now(),
      elapsedSeconds: 0,
      cluesInspected: {
        tablet: false,
        chest: false,
        torch: false,
      },
      coinFound: false,
      blockBroken: false,
      buttonChaseCount: 0,
    });
  };

  const startQuest = () => {
    setGameState((prev) => ({
      ...prev,
      stage: 'quest1_code',
      startTime: Date.now(),
      elapsedSeconds: 0,
    }));
  };



  const completeQuest1 = () => {
    setGameState((prev) => ({
      ...prev,
      xp: 100,
      stage: 'quest2_coin',
    }));
  };

  const completeQuest2 = () => {
    setGameState((prev) => ({
      ...prev,
      xp: 250,
      stage: 'quest3_mine',
    }));
  };

  const completeQuest3 = () => {
    setGameState((prev) => ({
      ...prev,
      xp: 500,
      stage: 'quest4_core',
    }));
  };

  const completeQuest4 = () => {
    setGameState((prev) => ({
      ...prev,
      stage: 'cinematic',
    }));
  };

  const completeCinematic = () => {
    // Transition to 211-frame scroll animation right after loading!
    setGameState((prev) => ({
      ...prev,
      stage: 'scroll_animation',
    }));
  };

  const completeScrollAnimation = () => {
    setGameState((prev) => ({
      ...prev,
      stage: 'reveal',
    }));
  };

  const handleClueInspect = (clueId: 'tablet' | 'chest' | 'torch') => {
    setGameState((prev) => ({
      ...prev,
      cluesInspected: {
        ...prev.cluesInspected,
        [clueId]: true,
      },
    }));
  };

  // Show HUD only during active quest stages (Quest 1 to Quest 4)
  const showHUD =
    gameState.stage === 'quest1_code' ||
    gameState.stage === 'quest2_coin' ||
    gameState.stage === 'quest3_mine' ||
    gameState.stage === 'quest4_core';

  return (
    <div className="relative min-h-screen bg-[#0c0c0c] text-[#f0f0f0] font-mono select-none overflow-x-hidden">
      {/* Global In-Game HUD */}
      {showHUD && (
        <HUD
          stage={gameState.stage}
          xp={gameState.xp}
          hearts={gameState.hearts}
          soundEnabled={gameState.soundEnabled}
          onToggleSound={handleToggleSound}
          onRestart={handleRestart}
        />
      )}

      {/* Game Stage Routing */}
      {gameState.stage === 'intro' && (
        <IntroScreen
          onStartQuest={startQuest}
        />
      )}

      {gameState.stage === 'quest1_code' && (
        <Quest1Code
          onComplete={completeQuest1}
          onClueInspect={handleClueInspect}
        />
      )}

      {gameState.stage === 'quest2_coin' && (
        <Quest2Coin onComplete={completeQuest2} />
      )}

      {gameState.stage === 'quest3_mine' && (
        <Quest3Mine onComplete={completeQuest3} />
      )}

      {gameState.stage === 'quest4_core' && (
        <Quest4Core onComplete={completeQuest4} />
      )}

      {gameState.stage === 'cinematic' && (
        <CinematicTransition onComplete={completeCinematic} />
      )}

      {gameState.stage === 'scroll_animation' && (
        <ScrollAnimationScreen
          onRestart={handleRestart}
          soundEnabled={gameState.soundEnabled}
          onToggleSound={handleToggleSound}
        />
      )}

      {gameState.stage === 'reveal' && (
        <RevealScreen
          elapsedSeconds={gameState.elapsedSeconds}
          xp={gameState.xp}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
