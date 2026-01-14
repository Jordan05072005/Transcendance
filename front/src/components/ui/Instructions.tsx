import React from 'react';
import { useTranslation } from "react-i18next"

const Instructions: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="mt-5 text-[#2a9d8f] text-center font-mono text-base opacity-70 font-bold z-10 text-shadow-[2px_0_red,-2px_0_blue]">
            P1: <span className="border border-[rgba(42,157,143,0.5)] py-0.5 px-1.5 font-bold text-[#33ff00]">W</span> <span className="border border-[rgba(42,157,143,0.5)] py-0.5 px-1.5 font-bold text-[#33ff00]">S</span> &nbsp;|&nbsp;
            P2: <span className="border border-[rgba(42,157,143,0.5)] py-0.5 px-1.5 font-bold text-[#33ff00]">↑</span> <span className="border border-[rgba(42,157,143,0.5)] py-0.5 px-1.5 font-bold text-[#33ff00]">↓</span> &nbsp;|&nbsp;
            <span className="border border-[rgba(42,157,143,0.5)] py-0.5 px-1.5 font-bold text-[#33ff00]">{t("mainPage.spacebar")}</span> {t("mainPage.start")}
        </div>
    );
};

export default Instructions;
