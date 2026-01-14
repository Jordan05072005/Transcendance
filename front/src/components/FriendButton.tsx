import React from 'react';
import { useGlitchEffect } from './ui/GlitchEffect';
import { useTranslation } from 'react-i18next';

interface FriendButtonProps {
  onClick: () => void;
}

export const FriendButton: React.FC<FriendButtonProps> = ({ onClick }) => {
  const { triggerGlitch } = useGlitchEffect();
  const { t } = useTranslation();

  const handleClick = () => {
    triggerGlitch(() => {
      onClick();
    });
  };

  return (
    <button
      id="friends-btn"
      className="font-mono font-bold text-[1.1rem] text-[#33ff00] uppercase bg-black py-2 px-4 border border-[#33ff00] shadow-[4px_4px_0px_rgba(51,255,0,0.2)] cursor-pointer flex items-center gap-2.5 transition-all hover:opacity-80 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_rgba(51,255,0,0.2)] z-50"
      onClick={handleClick}
    >
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] fill-[#33ff00]">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
      {t("friend.friend")}
    </button>
  );
};
