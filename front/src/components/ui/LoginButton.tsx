import React from 'react';
import { useGlitchEffect } from './GlitchEffect';

interface LoginButtonProps {
    onClick: () => void;
    username?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick, username }) => {
    const { triggerGlitch } = useGlitchEffect();

    const handleClick = () => {
        triggerGlitch(() => {
            onClick();
        });
    };

    return (
        <button
            id="login-btn"
            className="font-mono font-bold text-[1.1rem] text-[#33ff00] uppercase bg-black py-2 px-4 border border-[#33ff00] shadow-[4px_4px_0px_rgba(51,255,0,0.2)] cursor-pointer flex items-center gap-2.5 transition-all hover:opacity-80 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_rgba(51,255,0,0.2)]"
            onClick={handleClick}
        >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] fill-[#33ff00]">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            {username || 'LOGIN'}
        </button>
    );
};

export default LoginButton;
