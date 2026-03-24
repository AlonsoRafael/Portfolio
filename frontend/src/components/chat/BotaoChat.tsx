import Image from "next/image"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import JanelaChat from "./janelaChat"

export default function BotaoChat() {
	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						variant="ghost"
						className="fixed bottom-5 right-5 h-auto w-auto p-0 bg-transparent hover:bg-transparent"
						style={{ backgroundColor: "transparent", border: "none" }}
					>
						<Image src="/robot-assistant.png" alt="Chat Icon" width={50} height={50} />
					</Button>
				}
			/>

			<PopoverContent
				side="top"
				align="end"
				sideOffset={10}
				className="className=w-[calc(100vw-1rem)] max-w-[420] sm:w-[420] p-0 rounded-2xl bg-transparent ring-0 border-0 shadow-none overflow-hidden"
				style={{ backgroundColor: "transparent", border: "none" }}
			>
				<JanelaChat />
			</PopoverContent>
		</Popover>
	)
}
