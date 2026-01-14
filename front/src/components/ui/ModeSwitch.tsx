import React, { useState } from 'react';
import type { GameMode } from '../gamemode/GameMode';
import { playBeep } from './GlitchEffect';
import { useTranslation } from 'react-i18next';

interface ModeSwitchProps {
    mode: GameMode | "tournamentForm";
    onModeChange: (mode: GameMode) => void;
    disabled?: boolean;
}

const ModeSwitch: React.FC<ModeSwitchProps> = ({ mode, onModeChange, disabled }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipGlitch, setTooltipGlitch] = useState(false);
    const { t } = useTranslation();

    const handleModeClick = (newMode: GameMode) => {
        if (!disabled) {
            playBeep(800, 'square', 0.1);
            onModeChange(newMode);
        }
    };

    const handleMouseEnter = () => {
        if (disabled) {
            setTooltipGlitch(true);
            setShowTooltip(true);
            playBeep(200, 'sawtooth', 0.05, 0.03);
            setTimeout(() => setTooltipGlitch(false), 150);
        }
    };

    const handleMouseLeave = () => {
        if (showTooltip) {
            setTooltipGlitch(true);
            playBeep(150, 'sawtooth', 0.05, 0.03);
            setTimeout(() => {
                setShowTooltip(false);
                setTooltipGlitch(false);
            }, 150);
        }
    };

    return (
        <div
            className="flex gap-[30px] z-50 font-mono font-bold text-[1.1rem] bg-black py-2 px-4 border border-[#33ff00] shadow-[4px_4px_0px_rgba(51,255,0,0.2)] w-fit relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {showTooltip && disabled && (
                <div
                    className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-black border border-[#ffcc00] text-[#ffcc00] py-1.5 px-3 font-mono text-[0.85rem] font-bold whitespace-nowrap z-[100] shadow-[0_0_10px_rgba(255,204,0,0.3)] ${tooltipGlitch ? 'animate-hyper-glitch text-shadow-[2px_0_red,-2px_0_cyan]' : ''}`}
                >
                    {t("mainPage.locked")}
                </div>
            )}
            <div
                className={`transition-all flex items-center gap-2.5 uppercase hover:opacity-80 ${mode === 'ia' ? 'opacity-100 underline underline-offset-4' : ''} ${disabled ? 'cursor-not-allowed opacity-[0.4]' : 'cursor-pointer opacity-50'}`}
                onClick={() => handleModeClick('ia')}
            >
                <span className={`inline-block w-2.5 h-2.5 border-2 border-[#33ff00] relative ${mode === 'ia' ? 'after:content-[""] after:absolute after:top-0.5 after:left-0.5 after:right-0.5 after:bottom-0.5 after:bg-[#33ff00]' : ''}`}></span>
                CPU
            </div>
            <div
                className={`transition-all flex items-center gap-2.5 uppercase hover:opacity-80 ${mode === 'duel' ? 'opacity-100 underline underline-offset-4' : ''} ${disabled ? 'cursor-not-allowed opacity-[0.4]' : 'cursor-pointer'}`}
                onClick={() => handleModeClick('duel')}
            >
                <span className={`inline-block w-2.5 h-2.5 border-2 border-[#33ff00] relative ${mode === 'duel' ? 'after:content-[""] after:absolute after:top-0.5 after:left-0.5 after:right-0.5 after:bottom-0.5 after:bg-[#33ff00]' : ''}`}></span>
                1V1
            </div>
        </div>
    );
};

export default ModeSwitch;
