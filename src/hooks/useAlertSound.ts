import { useCallback, useRef, useState } from 'react';

type SoundType = 'error' | 'warning' | 'critical' | 'success' | 'notification';

// Web Audio API based sound generator
const createOscillatorSound = (
  audioContext: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.3
) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type;

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);

  return oscillator;
};

const playSoundPattern = (
  audioContext: AudioContext,
  pattern: { freq: number; duration: number; delay: number; type?: OscillatorType }[],
  volume = 0.3
) => {
  pattern.forEach(({ freq, duration, delay, type }) => {
    setTimeout(() => {
      createOscillatorSound(audioContext, freq, duration, type || 'sine', volume);
    }, delay * 1000);
  });
};

export const useAlertSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ?? window.webkitAudioContext!)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (isMuted) return;

    const audioContext = getAudioContext();
    
    // Resume audio context if suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
      void audioContext.resume();
    }

    switch (type) {
      case 'critical':
        // Alarming triple beep
        playSoundPattern(audioContext, [
          { freq: 880, duration: 0.15, delay: 0 },
          { freq: 880, duration: 0.15, delay: 0.2 },
          { freq: 1760, duration: 0.3, delay: 0.4, type: 'square' },
        ], volume);
        break;

      case 'error':
        // Double low beep
        playSoundPattern(audioContext, [
          { freq: 440, duration: 0.2, delay: 0, type: 'sawtooth' },
          { freq: 330, duration: 0.3, delay: 0.25, type: 'sawtooth' },
        ], volume);
        break;

      case 'warning':
        // Single mid-tone alert
        playSoundPattern(audioContext, [
          { freq: 660, duration: 0.15, delay: 0 },
          { freq: 660, duration: 0.15, delay: 0.2 },
        ], volume);
        break;

      case 'success':
        // Pleasant ascending tone
        playSoundPattern(audioContext, [
          { freq: 523, duration: 0.1, delay: 0 },
          { freq: 659, duration: 0.1, delay: 0.1 },
          { freq: 784, duration: 0.15, delay: 0.2 },
        ], volume);
        break;

      case 'notification':
        // Soft ping
        playSoundPattern(audioContext, [
          { freq: 800, duration: 0.1, delay: 0 },
        ], volume * 0.5);
        break;
    }
  }, [isMuted, volume, getAudioContext]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return {
    playSound,
    isMuted,
    toggleMute,
    setMuted: setIsMuted,
    volume,
    setVolume,
  };
};
