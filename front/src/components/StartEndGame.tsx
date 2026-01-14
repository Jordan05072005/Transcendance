interface endgame {
	message: string;
	onClose: () => void;
}

export default function StartEndGame({message, onClose}: endgame) {
	return (
		<div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
			<div className="bg-white p-6 rounded-xl shadow-xl w-80 relative">
				<button onClick={onClose} className="absolute right-1 top-1 text-gray-400 hover:text-black !bg-white">
					X
				</button>
				<p className="text-center text-xl font-bold">{message}</p>
			</div>
		</div>
	);
}