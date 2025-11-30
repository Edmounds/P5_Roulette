import React, { useState, useEffect, useRef, useCallback } from 'react';
import configSource from '../../config/config.yaml?raw';
import bgmTrack from '../../../resource/music/Lyn - Wake Up, Get Up, Get Out There.flac';
import { buildDefaultNames, drawRouletteWheel } from '../../controller/rouletteController';
import { useAudioController } from '../../controller/useAudioController';
import { useRouletteGame } from '../../controller/useRouletteGame';
import BackgroundLayers from './BackgroundLayers';
import TitleBanner from './TitleBanner';
import MenuButtons from './MenuButtons';
import RouletteStage from './RouletteStage';
import SpinButton from './SpinButton';
import SettingsModal from './SettingsModal';
import ResultOverlay from './ResultOverlay';

const DEFAULT_NAMES = buildDefaultNames(configSource);

const P5Roulette = () => {
  const [names, setNames] = useState(DEFAULT_NAMES);
  const [inputText, setInputText] = useState(DEFAULT_NAMES.join('\n'));
  const [showSettings, setShowSettings] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const canvasRef = useRef(null);

  const { isMusicPlaying, toggleMusic } = useAudioController(bgmTrack);

  const handleSpinEnd = useCallback(() => {
    setTimeout(() => {
      setShowResult(true);
    }, 800);
  }, []);

  const { rotation, arrowState, isSpinning, winner, spin } = useRouletteGame(names, handleSpinEnd);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      drawRouletteWheel(canvas, names, rotation);
    }
  }, [names, rotation]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const saveSettings = () => {
    const newNames = inputText.split('\n').filter((name) => name.trim() !== '');
    if (newNames.length > 0) {
      setNames(newNames);
    }
    setShowSettings(false);
  };

  const handleSpinStart = () => {
    setShowResult(false);
    spin();
  };

  const handleCloseResult = () => {
    setShowResult(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#1a1a1a] overflow-hidden relative font-sans select-none">
      <BackgroundLayers />
      <TitleBanner />
      <MenuButtons isMusicPlaying={isMusicPlaying} toggleMusic={toggleMusic} onEdit={() => setShowSettings(true)} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <RouletteStage canvasRef={canvasRef} arrowState={arrowState} />
        <SpinButton isSpinning={isSpinning} onClick={handleSpinStart} />
      </div>

      <SettingsModal
        show={showSettings}
        inputText={inputText}
        onChange={handleInputChange}
        onCancel={() => setShowSettings(false)}
        onSave={saveSettings}
      />

      <ResultOverlay show={showResult} winner={winner} onClose={handleCloseResult} />
    </div>
  );
};

export default P5Roulette;
