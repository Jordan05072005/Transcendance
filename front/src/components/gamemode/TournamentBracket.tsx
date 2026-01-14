import { useTranslation } from "react-i18next";
import Card from "../ui/VhsCard";
import React from "react";

interface TournamentBracketProps {
    players: string[];
    winners: string[];
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({ players, winners }) => {
    const { t } = useTranslation();

    const p1 = players[0] || "P1";
    const p2 = players[1] || "P2";
    const p3 = players[2] || "P3";
    const p4 = players[3] || "P4";

    const winner1 = winners[0];
    const winner2 = winners[1];
    const champion = winners[2];

    const PlayerSlot = ({ name, isWinner, isChampion = false }: { name: string; isWinner?: boolean, isChampion?: boolean }) => (
        <div className={`
      px-2 py-0.5 sm:px-3 sm:py-1 border border-[#33ff00] rounded 
      font-mono text-[10px] sm:text-xs md:text-sm tracking-wider sm:tracking-widest uppercase
      transition-all duration-500
      ${isWinner ? "bg-[#33ff00]/20 text-[#33ff00] shadow-[0_0_10px_rgba(51,255,0,0.4)]" : "bg-black/60 text-[#33ff00]/60"}
      ${isChampion ? "text-[#ffd700] border-[#ffd700] bg-[#ffd700]/10 shadow-[0_0_15px_rgba(255,215,0,0.5)] animate-pulse" : ""}
      min-w-[70px] sm:min-w-[90px] md:min-w-[120px] text-center
    `}>
            {name || "-"}
        </div>
    );

    return (
        <div className="xl:absolute xl:left-[1%] xl:top-[56%] xl:-translate-y-1/2 z-40 mt-4 xl:mt-0 scale-[0.75] sm:scale-[0.85] md:scale-90 xl:scale-100 origin-center xl:origin-left">
            <Card className="p-3 sm:p-4 md:p-6 bg-black/90 border-[#33ff00]">
                <h3 className="text-[#33ff00] font-mono text-xs sm:text-sm md:text-md mb-3 sm:mb-4 md:mb-6 text-center uppercase border-b border-[#33ff00]/30 pb-1 sm:pb-2">
                    TOURNAMENT
                </h3>

                <div className="flex items-center gap-4 sm:gap-6 md:gap-10">
                    <div className="flex flex-col gap-6 sm:gap-8 md:gap-12">
                        <div className="flex flex-col gap-2 sm:gap-3 md:gap-5 relative">
                            <PlayerSlot name={p1} isWinner={winner1 === p1} />
                            <PlayerSlot name={p2} isWinner={winner1 === p2} />

                            <div className="absolute right-[-16px] sm:right-[-20px] md:right-[-26px] top-[50%] h-[30px] sm:h-[38px] md:h-[46px] -translate-y-1/2 w-[16px] sm:w-[20px] md:w-[26px] border-y border-r border-[#33ff00]/40 rounded-r-none pointer-events-none" />
                        </div>

                        <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 relative">
                            <PlayerSlot name={p3} isWinner={winner2 === p3} />
                            <PlayerSlot name={p4} isWinner={winner2 === p4} />

                            <div className="absolute right-[-16px] sm:right-[-20px] md:right-[-26px] top-[50%] h-[30px] sm:h-[38px] md:h-[46px] -translate-y-1/2 w-[16px] sm:w-[20px] md:w-[26px] border-y border-r border-[#33ff00]/40 rounded-r-none pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-12 sm:gap-16 md:gap-24 relative -ml-2 sm:-ml-3 md:-ml-4">
                        <div className="relative">
                            <PlayerSlot
                                name={winner1 || "?"}
                                isWinner={champion === winner1 && !!champion}
                            />
                            <div className="absolute right-[-16px] sm:right-[-20px] md:right-[-26px] top-[50%] h-[1px] w-[16px] sm:w-[20px] md:w-[26px] bg-[#33ff00]/40" />
                            <div className="absolute right-[-16px] sm:right-[-20px] md:right-[-26px] top-1/2 w-[1px] h-[40px] sm:h-[52px] md:h-[72px] bg-[#33ff00]/40 translate-y-0" />

                        </div>
                        <div className="relative">
                            <PlayerSlot
                                name={winner2 || "?"}
                                isWinner={champion === winner2 && !!champion}
                            />
                            <div className="absolute right-[-16px] sm:right-[-20px] md:right-[-26px] top-[50%] h-[1px] w-[16px] sm:w-[20px] md:w-[26px] bg-[#33ff00]/40" />
                            <div className="absolute right-[-16px] sm:right-[-20px] md:right-[-26px] bottom-1/2 w-[1px] h-[30px] sm:h-[40px] md:h-[54px] bg-[#33ff00]/40 translate-y-0" />
                        </div>

                        <div className="absolute right-[-36px] sm:right-[-44px] md:right-[-56px] top-1/2 -translate-y-1/2 w-[20px] sm:w-[24px] md:w-[30px] h-[1px] bg-[#33ff00]/40" />
                    </div>
                    <div className="pl-2 sm:pl-3 md:pl-4">
                        <PlayerSlot
                            name={champion || "?"}
                            isWinner={true}
                            isChampion={!!champion}
                        />
                        {!!champion && (
                            <div className="text-center text-[8px] sm:text-[9px] md:text-[10px] text-[#ffd700] mt-1 sm:mt-2 animate-bounce">
                                WINNER
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default TournamentBracket;
