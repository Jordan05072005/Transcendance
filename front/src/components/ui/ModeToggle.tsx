import { cn } from "../../lib/utils";
import { type GameMode } from "../gamemode/GameMode";

interface ModeToggleProps {
    mode: GameMode | "tournamentForm";
    setMode: (mode: GameMode | "tournamentForm") => void;
    className?: string;
}

export function ModeToggle({ mode, setMode, className }: ModeToggleProps) {
    const modes = [
        { id: "ia", label: "AI" },
        { id: "duel", label: "DUEL" },
        { id: "tournament", label: "TOURNAMENT" },
    ];

    return (
        <div className={cn("inline-flex bg-white/5 p-1 rounded-full border border-white/10 relative", className)}>
            {modes.map((m) => {
                const isActive = mode === m.id || (m.id === "tournament" && mode === "tournamentForm");
                return (
                    <button
                        key={m.id}
                        onClick={() => setMode(m.id as GameMode)}
                        className={cn(
                            "relative z-10 px-6 py-2 text-sm font-bold tracking-wider transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full",
                            isActive ? "text-white bg-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "text-white/40 hover:text-white/70 hover:bg-white/5"
                        )}
                    >
                        {m.label}
                    </button>
                );
            })}
        </div>
    );
}
