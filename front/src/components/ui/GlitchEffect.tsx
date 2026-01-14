import { useState, useCallback } from 'react';

let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtx;
};

export const playBeep = (freq = 800, type: OscillatorType = 'square', duration = 0.1, vol = 0.05) => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
};

export const playGlitchSound = () => {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    const bufferSize = ctx.sampleRate * 0.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    noise.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
};

export const useGlitchEffect = () => {
    const [isTransitioning, setIsTransitioning] = useState(false);

    const triggerGlitch = useCallback((callback?: () => void) => {
        if (isTransitioning) return;
        setIsTransitioning(true);

        const wrapper = document.getElementById('main-wrapper');
        if (wrapper) {
            wrapper.classList.add('hyper-glitch-active');
            playGlitchSound();
        }

        setTimeout(() => {
            if (wrapper) {
                wrapper.classList.remove('hyper-glitch-active');
            }
            if (callback) callback();
            setIsTransitioning(false);
        }, 600);
    }, [isTransitioning]);

    return { triggerGlitch, isTransitioning, playBeep, playGlitchSound };
};
