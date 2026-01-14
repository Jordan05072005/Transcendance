import { User } from "lucide-react";
import { Button } from "./ui/button";

export function UserButton({onClick} : any){
	return (
		<Button onClick={onClick}>
			<User className="mr-2 h-4 w-4 text-black"></User>
			<p className="text-black">Login</p>
		</Button>
	)
}