import Card from "./components/ui/VhsCard"
import { useEffect, useState } from "react"
import { useUser } from "./hook/useUser"
import { DataSelect } from "./components/SelectBox"
import { useTranslation } from "react-i18next"
import { useMatchHistory } from "./hook/useMatchHistory"
import { InputBox, InputImg } from "./components/BoxInput"
import type { UseAuthReturn, User } from "./types/user.types"





const validateEmail = (email: string, t: any): string | null => {
    if (!email || email.trim().length === 0) return t("validate.email.required");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return t("validate.email.invalid");
    return null;
};



const validateUsername = (username: string, t: any): string | null => {
    if (!username || username.trim().length === 0) return t("validate.username.required");
    if (username.length < 3) return t("validate.username.minLength");
    if (username.length > 20) return t("validate.username.maxLength");
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return t("validate.username.invalidChars");
    return null;
};

export default function ProfilePage({ auth }:
	{
		auth: UseAuthReturn
	}) {
	const { t } = useTranslation()
	const { user } = useUser();
	const [tempvalue, setTempValue] = useState<User>(user);
	const { matches, loading, error } = useMatchHistory();
	const [usernameError, setUsernameError] = useState<string | null>(null);
	const [emailError, setEmailError] = useState<string | null>(null);

	useEffect(() => {
		setTempValue(user);
	}, [user]);

	const data = [{ value: "en", name: t("lang.english") }, { value: "fr", name: t("lang.french") }, { value: "es", name: t("lang.spanish") }]

	const handleUsernameChange = (value: string) => {
		setTempValue({ ...tempvalue, username: value });
		setUsernameError(validateUsername(value, t));
	};

	const handleEmailChange = (value: string) => {
		setTempValue({ ...tempvalue, email: value });
		setEmailError(validateEmail(value, t));
	};

	const handleSave = async() => {
		const usernameErr = validateUsername(tempvalue.username, t);
		const emailErr = validateEmail(tempvalue.email, t);
		setUsernameError(usernameErr);
		setEmailError(emailErr);

		if (!usernameErr && !emailErr) {
			await auth.sendUpdate(tempvalue);
		}
	};

	return (
		<div className="fixed top-0 left-0 right-0 bottom-0 z-[100] flex items-center justify-center">
			<div className="absolute top-0 left-0 right-0 bottom-0 bg-black/80"></div>

			<div className="relative min-h-screen bg-black/80 flex items-center justify-center p-4">
				<Card className="flex flex-col items-center gap-5 bg-[rgba(10,10,10,0.9)] border border-[#33ff00] p-[40px_50px] shadow-[0_0_40px_rgba(0,0,0,1),6px_6px_0px_rgba(51,255,0,0.2)] w-[500px] z-[60] max-h-[90vh] overflow-y-auto">
					<div className="text-2xl mb-5 uppercase border-b-2 border-[#33ff00] pb-2.5 w-full text-center tracking-[2px] animate-text-flicker">{t("profile.profile")}</div>

					<InputImg image={tempvalue.avatar || null} setImage={(value: File | null) => { setTempValue({ ...tempvalue, avatar: value }) }} url={tempvalue.avatarPath} txt={t("profile.changeImg")} h={30} w={30}></InputImg>

					<div className="w-full">
						<InputBox type="text" value={tempvalue.username} title={t("profile.username")}
							onChange={handleUsernameChange} />
						{usernameError && <p className="text-[#ff3333] text-[0.8rem] mt-1 font-mono">{usernameError}</p>}
					</div>

					<div className="w-full">
						<InputBox type="text" value={tempvalue.email} title={t("profile.email")}
							onChange={handleEmailChange} />
						{emailError && <p className="text-[#ff3333] text-[0.8rem] mt-1 font-mono">{emailError}</p>}
					</div>

					<DataSelect data={data} value={tempvalue.lang} placeholder={t("profile.language")}
						setVal={(value: string) => { setTempValue({ ...tempvalue, lang: value }); }} ></DataSelect>

					<div className="flex gap-5 w-full">
						<div className="w-full flex flex-col gap-1.5 font-mono flex-1">
							<div className="text-[0.9rem] opacity-80">{t("profile.wins")}</div>
							<div className="bg-black border border-[#33ff00] text-[#33ff00] font-mono text-[1.1rem] py-2 px-4 shadow-[inset_0_0_10px_rgba(51,255,0,0.1)] w-full text-center">{user.nbrVictory}</div>
						</div>
						<div className="w-full flex flex-col gap-1.5 font-mono flex-1">
							<div className="text-[0.9rem] opacity-80">{t("profile.defeates")}</div>
							<div className="bg-black border border-[#33ff00] text-[#ff3333] font-mono text-[1.1rem] py-2 px-4 shadow-[inset_0_0_10px_rgba(51,255,0,0.1)] w-full text-center">{user.nbrDefeat}</div>
						</div>
					</div>

					<div className="flex gap-5 w-full">
						<div className="w-full flex flex-col gap-1.5 font-mono flex-1">
							<div className="text-[0.9rem] opacity-80">{t("profile.level")}</div>
							<div className="bg-black border border-[#33ff00] text-[#33ff00] font-mono text-[1.1rem] py-2 px-4 shadow-[inset_0_0_10px_rgba(51,255,0,0.1)] w-full text-center">{(user.nbrVictory * 0.2 + (user.nbrVictory >= 1 ? 1 : 0) + (user.nbrDefeat >= 1 ? 1 : 0) + (user.nbrVictory == 5 ? 1 : 0)).toFixed(2)}</div>
						</div>
						<div className="w-full flex flex-col gap-1.5 font-mono flex-1">
							<div className="text-[0.9rem] opacity-80">{t("profile.ratio")}</div>
							{user.nbrVictory > 0 && user.nbrDefeat > 0 && <div className="bg-black border border-[#33ff00] text-[#33ff00] font-mono text-[1.1rem] py-2 px-4 shadow-[inset_0_0_10px_rgba(51,255,0,0.1)] w-full text-center">{(user.nbrVictory / (user.nbrVictory + user.nbrDefeat) * 100).toFixed(2)}%</div>}
							{user.nbrVictory > 0 && user.nbrDefeat == 0 && <div className="bg-black border border-[#33ff00] text-[#33ff00] font-mono text-[1.1rem] py-2 px-4 shadow-[inset_0_0_10px_rgba(51,255,0,0.1)] w-full text-center">100%</div>}
							{user.nbrVictory == 0 && user.nbrDefeat > 0 && <div className="bg-black border border-[#33ff00] text-[#33ff00] font-mono text-[1.1rem] py-2 px-4 shadow-[inset_0_0_10px_rgba(51,255,0,0.1)] w-full text-center">0%</div>}
							{user.nbrVictory == 0 && user.nbrDefeat == 0 && <div className="bg-black border border-[#33ff00] text-[#33ff00] font-mono text-[1.1rem] py-2 px-4 shadow-[inset_0_0_10px_rgba(51,255,0,0.1)] w-full text-center">N/A</div>}
						</div>
					</div>

					<div className="w-full mt-2.5">
						<div className="text-[0.9rem] opacity-80">{t("profile.matchHistory")}</div>
						<div className="max-h-[60px] overflow-y-auto border border-[#33ff00] p-2.5 mt-1.5">
							{loading && <p className="opacity-50">{t("profile.loading")}</p>}
							{error && <p className="text-[#ff3333]">{error}</p>}
							{matches.length === 0 && !loading && <p className="opacity-50">{t("profile.noMatches")}</p>}
							{matches.map(match => (
								<div key={match.id} className="border-b border-[rgba(51,255,0,0.2)] py-1.5 mb-1.5">
									<span className={`font-bold ${match.result === 'win' ? 'text-[#33ff00]' : 'text-[#ff3333]'}`}>
										{match.result === 'win' ? t("profile.win") : t("profile.defeate")}
									</span>
									<span className="ml-2.5 opacity-80">
										vs {match.opponentUsername} : {match.playerScore}-{match.opponentScore}
									</span>
								</div>
							))}
						</div>
					</div>

					<div className="w-full mt-2.5">
						<div className="text-[0.9rem] opacity-80">{t("profile.achivements")}</div>
						<div className="max-h-[60px] overflow-y-auto border border-[#33ff00] p-2.5 mt-1.5">
							{user.nbrVictory === 0 && user.nbrDefeat == 0 && <p className="opacity-50">NO ACHIVEMENTS</p>}
							{user.nbrVictory >= 1 &&
								<div className="border-b border-[rgba(51,255,0,0.2)] py-1.5 mb-1.5">
									<p className="font-bold text-[#fff000]">{t("profile.achivement1")}</p>
									<p className="text-[#33ff00]">{t("profile.achivement1Desc")}</p>
								</div>}
							{user.nbrDefeat >= 1 &&
								<div className="border-b border-[rgba(51,255,0,0.2)] py-1.5 mb-1.5">
									<p className="font-bold text-[#fff000]">{t("profile.achivement2")}</p>
									<p className="text-[#33ff00]">{t("profile.achivement2Desc")}</p>
								</div>}
							{user.nbrVictory >= 5 &&
							<div className="border-b border-[rgba(51,255,0,0.2)] py-1.5 mb-1.5">
								<p className="font-bold text-[#fff000]">{t("profile.achivement3")}</p>
								<p className="text-[#33ff00]">{t("profile.achivement3Desc")}</p>
							</div>}
						</div>
					</div>

					<label className="flex items-center gap-2.5 w-full mt-2.5">
						<input
							name="checkbox"
							type="checkbox"
							checked={!!tempvalue.isTwoFactorEnabled}
							onChange={() => {
								setTempValue({ ...tempvalue, isTwoFactorEnabled: !tempvalue.isTwoFactorEnabled });
							}}
							style={{ accentColor: '#33ff00' }}
						/>
						<span className="font-mono text-[0.9rem]">{t("profile.enable")}</span>
					</label>

					<div className="flex gap-4 w-full mt-5">
						<button
							className="font-mono font-bold text-[1.1rem] uppercase bg-black py-2 px-4 border cursor-pointer flex items-center gap-2.5 transition-all hover:opacity-80 hover:translate-x-0.5 hover:translate-y-0.5 border-[#2a9d8f] text-[#2a9d8f] hover:bg-[#2a9d8f] hover:text-black flex-1 justify-center"
							onClick={() => auth.SetProfilPage(false)}
						>
							{t("profile.exit")}
						</button>
						<button
							className="font-mono font-bold text-[1.1rem] text-[#33ff00] uppercase bg-black py-2 px-4 border border-[#33ff00] shadow-[4px_4px_0px_rgba(51,255,0,0.2)] cursor-pointer flex items-center gap-2.5 transition-all hover:opacity-80 hover:translate-x-0.5 hover:translate-y-0.5 flex-1 justify-center"
							onClick={handleSave}
						>
							{t("profile.saveButton")}
						</button>
					</div>
					<div className="w-full mt-5 pt-4 border-t border-[rgba(255,51,51,0.3)]">
						<button
							className="font-mono font-bold text-[1.1rem] uppercase py-2 px-4 border cursor-pointer flex items-center gap-2.5 transition-all hover:opacity-80 w-full justify-center border-[#ff3333] text-[#ff3333] bg-[rgba(255,51,51,0.1)] hover:bg-[rgba(255,51,51,0.2)]"
							onClick={() => { auth.logout(true); auth.SetProfilPage(false); }}
						>
							{t("profile.disconnect")}
						</button>
					</div>
					<div className="w-full mt-5 pt-4 border-t border-[rgba(255,51,51,0.3)]">
						<button
							className="font-mono font-bold text-[1.1rem] uppercase py-2 px-4 border cursor-pointer flex items-center gap-2.5 transition-all hover:opacity-80 w-full justify-center border-[#ff3333] text-[#ff3333] bg-[rgba(255,51,51,0.1)] hover:bg-[rgba(255,51,51,0.2)]"
							onClick={() => { auth.deleteUser(user.id) }}
						>
							{t("profile.deleteButton")}
						</button>
					</div>
				</Card>
			</div>
		</div>
	)
}
