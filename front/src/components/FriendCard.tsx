type FriendCardProps = {
	username: string;
	login: boolean;
	onDelete: () => void;
};

export function FriendCard({ username, login, onDelete }: FriendCardProps) {
	return (
		<div className="border-b border-[rgba(51,255,0,0.2)] py-1.5 mb-1.5 flex items-center justify-between">
			<div className="flex items-center gap-2">
				<span className="font-bold text-[#33ff00]">{username}</span>
				<span className={`text-sm ${login ? 'text-[#33ff00]' : 'text-[#ff3333]'}`}>
					{login ? "●" : "○"}
				</span>
			</div>
			<button
				onClick={onDelete}
				className="font-mono font-bold text-[0.7rem] uppercase py-0.5 px-1.5 border cursor-pointer transition-all hover:opacity-80 border-[#ff3333] text-[#ff3333] hover:bg-[#ff3333] hover:text-black"
			>
				✕
			</button>
		</div>
	);
}