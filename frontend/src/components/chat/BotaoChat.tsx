"use client"

import dynamic from "next/dynamic"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import RoboOlhando from "./RoboOlhando"

const JanelaChat = dynamic(() => import("./janelaChat"), {
	loading: () => (
		<div className="flex items-center justify-center h-[360px] bg-zinc-900/90 rounded-2xl text-white">
			<span className="text-xs text-zinc-400">Carregando AlonsoBot...</span>
		</div>
	),
	ssr: false,
})

export default function BotaoChat() {
	return (
		<Popover>
			<PopoverTrigger
				className="fixed bottom-3.5 right-3.5 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50 flex items-center justify-center p-0 bg-transparent hover:bg-transparent border-0 outline-none cursor-pointer hover:scale-105 sm:hover:scale-110 active:scale-95 transition-transform duration-200 drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)] sm:drop-shadow-[0_12px_32px_rgba(0,0,0,0.85)] focus-visible:ring-2 focus-visible:ring-white"
				aria-label="Abrir AlonsoBot"
			>
				<RoboOlhando
					className="w-[48px] h-[60px] sm:w-[72px] sm:h-[90px] md:w-[88px] md:h-[110px] lg:w-[104px] lg:h-[130px]"
					alt="AlonsoBot"
				/>
			</PopoverTrigger>

			<PopoverContent
				side="top"
				align="end"
				sideOffset={8}
				className="z-[9999] w-[calc(100vw-1.5rem)] max-w-[420px] sm:w-[420px] p-0 rounded-2xl bg-transparent ring-0 border-0 shadow-2xl overflow-hidden"
				style={{ backgroundColor: "transparent", border: "none" }}
			>
				<JanelaChat />
			</PopoverContent>
		</Popover>
	)
}

