import { useEffect, useRef } from "react";

interface BackgroundProps {
    isPaused?: boolean;
}

const Background = ({ isPaused = false }: BackgroundProps) => {
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bgRef.current) {
            let content = "";
            const rows = 200;
            const cols = 350;

            for (let y = 0; y < rows; y++) {
                let line = "";
                for (let x = 0; x < cols; x++) {
                    if (y % 5 === 0) {
                        if (x % 10 === 0) line += "+";
                        else line += "-";
                    } else {
                        if (x % 10 === 0) line += "|";
                        else line += " ";
                    }
                }
                content += line + "\n";
            }
            bgRef.current.textContent = content;
        }
    }, []);

    return (
        <>
            <div className="fixed inset-0 z-[-1] bg-[#050505] min-w-screen min-h-screen" />
            <div
                ref={bgRef}
                className={`fixed -top-50% -left-50% w-250% h-250% z-[0] text-[#1a3a1a] leading-[14px] text-[14px] whitespace-pre truncate pointer-events-none animate-[scrollGrid_10s_linear_infinite] ${isPaused ? '[animation-play-state:paused]' : ''}`}
            ></div>
        </>
    );
};

export default Background;
