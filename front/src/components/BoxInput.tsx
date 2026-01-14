import { useMemo } from "react";

export function InputBox({ type, value, title, onChange, disabled }:
	{
		type: string,
		value: string,
		title: string,
		onChange: (value: string) => void,
		disabled?: boolean
	}
) {
	return (
		<div className="w-full flex flex-col gap-1.5 font-mono">
			<div className="text-[0.9rem] opacity-80">{title} {'>'}</div>
			<input
				name={type}
				type={type}
				value={value ?? ""}
				placeholder={title}
				onChange={e => onChange(e.target.value)}
				className={`${disabled ? 'opacity-[0.5]' : 'opacity-[1]'} bg-black border border-[#33ff00] text-[#33ff00] font-mono text-[1.1rem] py-2 px-4 outline-none shadow-[inset_0_0_10px_rgba(51,255,0,0.1)] w-full box-border focus:shadow-[inset_0_0_15px_rgba(51,255,0,0.3)] focus:bg-[#051a05]`}
			/>
		</div>
	)
}

export function InputImg({ image, setImage, txt, h, w, url }: {
	image: File | null,
	setImage: (img: File | null) => void,
	txt: string,
	h: number,
	w: number,
	url: string | undefined
}) {
	const imageUrl = useMemo(() => {
		if (url) return `users/${url}`;
		if (image) return URL.createObjectURL(image);
		return "";
	}, [url, image]);
	return (
		<div className="flex flex-col items-center">
			<input
				type="file"
				accept="image/*"
				id="fileInput"
				className="hidden"
				onChange={(e) => {
					const file = e.target.files?.[0] ?? null;
					setImage(file);
				}}
			/>

			<label htmlFor="fileInput" className="cursor-pointer">
				{imageUrl ? (
					<img
						src={imageUrl}
						alt="Preview"
						className={`w-${w} h-${h} object-cover border-4 border-gray-300 rounded-lg`}
					/>
				) : (
					<div className="w-48 h-48 flex items-center justify-center border-4 border-gray-300 rounded-lg text-gray-400">
						{txt}
					</div>
				)}
			</label>
		</div>
	)

}