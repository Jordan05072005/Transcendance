import { X } from "lucide-react"

export default function CloseButton({onClick}: {onClick: () => void}){
	return (			
	<button
		className="absolute top-3 right-3 !bg-red-500 !text-white"
		onClick={onClick}
		>
		<X className="w-5 h-5 text-white" />
	</button>)
}