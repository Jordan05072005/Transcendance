import { useState, useEffect } from "react";
import { useUser } from "../../hook/useUser";
import Card from "../ui/VhsCard";
import { playBeep } from "../ui/GlitchEffect";
import { useNotification } from "../ui/Notification";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

interface onFunctions {
	onClose: () => void;
	onValidate: (players: string[]) => void;
}

function checkUnique(users: string[], notify: (msg: string, type: string) => void, t: TFunction): number {
	const duplicates = users.filter((item, index) => users.indexOf(item) !== index);
	if (duplicates[0] !== undefined) {
		notify(t('tournamentForm.errors.duplicate', { name: duplicates[0] }), 'error');
		return 1;
	}
	return 0;
}

export default function TournamentForm({ onClose, onValidate }: onFunctions) {
	const { t } = useTranslation();
	const { user } = useUser();
	const [names, setNames] = useState(() =>
		user.login ? [user.username, "", "", ""] : ["", "", "", ""]
	);
	const [dots, setDots] = useState(".");
	const { notify } = useNotification();

	useEffect(() => {
		const interval = setInterval(() => {
			setDots(prev => {
				if (prev === ".") return "..";
				if (prev === "..") return "...";
				return ".";
			});
		}, 400);
		return () => clearInterval(interval);
	}, []);

	const updateName = (index: number, value: string) => {
		if (value.length > 12) return notify(t('tournamentForm.errors.tooLong'), 'error');

		const newNames = [...names];
		newNames[index] = value;
		setNames(newNames);
	};

	const fullPlayers = names.every(name => name.trim() !== "");

	const handleClose = () => {
		playBeep(400, 'square', 0.1);
		onClose();
	};

	const handleStart = () => {
		if (!checkUnique(names, notify, t)) {
			playBeep(1000, 'square', 0.15);
			onValidate(names);
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-[60]">
			<Card className="w-[350px] p-8">
				<div className="mb-6 border-b border-[#33ff00] pb-3">
					<h2 className="font-mono font-bold text-[1.2rem] text-[#33ff00] uppercase tracking-wider animate-text-flicker text-center">
						{t('tournamentForm.title')}
					</h2>
				</div>
				<p className="font-mono text-[0.9rem] text-[#33ff00]/70 mb-4 text-center">
					{t('tournamentForm.subtitle')}
				</p>
				<div className="flex flex-col gap-3 mb-4">
					{names.map((name, i) => (
						<div key={`player-${i}`} className="flex items-center gap-2">
							<span className="font-mono text-[#33ff00]/50 text-sm w-6">P{i + 1}</span>
							<input
								id={`${i}`}
								value={name}
								onChange={(e) => updateName(i, e.target.value)}
								className="flex-1 bg-black border border-[#33ff00] text-[#33ff00] font-mono text-[1rem] py-2 px-3 outline-none focus:shadow-[inset_0_0_15px_rgba(51,255,0,0.3)] focus:bg-[#051a05] transition-all placeholder:text-[#33ff00]/30"
								placeholder={t('tournamentForm.player', { number: i + 1 })}
							/>
						</div>
					))}
				</div>
				<button
					onClick={handleStart}
					disabled={!fullPlayers}
					className={`w-full font-mono font-bold text-[1.1rem] uppercase py-3 px-4 border transition-all mb-3 ${fullPlayers
						? 'bg-black text-[#33ff00] border-[#33ff00] shadow-[4px_4px_0px_rgba(51,255,0,0.2)] cursor-pointer hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_rgba(51,255,0,0.2)]'
						: 'bg-[#111] text-[#33ff00]/30 border-[#33ff00]/30 cursor-not-allowed'
						}`}
				>
					{fullPlayers ? t('tournamentForm.start') : `${t('tournamentForm.waiting')}${dots}`}
				</button>
				<button
					onClick={handleClose}
					className="w-full font-mono font-bold text-[1rem] text-[#33ff00]/70 uppercase py-2 px-4 border border-[#33ff00]/50 bg-transparent transition-all hover:text-[#33ff00] hover:border-[#33ff00]"
				>
					{t('tournamentForm.exit')}
				</button>
			</Card>
		</div>
	);
}
