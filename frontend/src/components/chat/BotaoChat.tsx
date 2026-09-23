"use client"

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import JanelaChat from "./janelaChat"
import RoboOlhando from "./RoboOlhando"

export default function BotaoChat() {
	return (
		<Popover>
			<PopoverTrigger
				className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50 flex items-center justify-center p-0 bg-transparent hover:bg-transparent border-0 outline-none cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200 drop-shadow-[0_12px_32px_rgba(0,0,0,0.85)] focus-visible:ring-2 focus-visible:ring-white"
				aria-label="Abrir AlonsoBot"
			>
				<RoboOlhando
					className="w-[70px] h-[88px] sm:w-[84px] sm:h-[105px] md:w-[98px] md:h-[122px] lg:w-[112px] lg:h-[140px]"
					alt="AlonsoBot"
				/>
			</PopoverTrigger>

			<PopoverContent
				side="top"
				align="end"
				sideOffset={12}
				className="z-[9999] w-[calc(100vw-2rem)] max-w-[420px] sm:w-[420px] p-0 rounded-2xl bg-transparent ring-0 border-0 shadow-2xl overflow-hidden"
				style={{ backgroundColor: "transparent", border: "none" }}
			>
				<JanelaChat />
			</PopoverContent>
		</Popover>
	)
}

