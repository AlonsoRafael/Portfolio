"use client"
import useChat from "@/hooks/useChat"
import { IconMessages, IconReload, IconSend } from "@tabler/icons-react"
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react"
import BalaoMensagem from "./balaoMensagem"
import Image from "next/image"

export default function JanelaChat() {
	const { mensagens, pensando, adicionarMensagem, limparMensagens } = useChat()
	const [texto, setTexto] = useState("")
	const fimChatRef = useRef<HTMLDivElement>(null)

	function enviarMensagem() {
		const textoLimpo = texto.trim()
		if (!textoLimpo) return
		adicionarMensagem(texto)
		setTexto("")
	}

	useEffect(() => {
		const fim = fimChatRef.current
		const lista = fim?.parentElement
		if (!lista) return
		lista.scrollTo({ top: lista.scrollHeight, behavior: "smooth" })
	}, [mensagens])

	return (
		<div className="flex flex-col bg-zinc-200 rounded-2xl text-black overflow-hidden shadow-2xl border border-zinc-300">
			<div className="flex justify-between items-center bg-white px-4 py-3 border-b border-zinc-200">
				<div className="flex items-center gap-2.5">
					<div className="relative">
						<Image
							src="/robot/frames/frame_315.webp"
							alt="AlonsoBot"
							width={36}
							height={36}
							className="object-contain"
						/>
						<span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
					</div>
					<div>
						<h2 className="text-base font-bold leading-tight">AlonsoBot</h2>
						<span className="text-xs text-emerald-600 font-medium">Online</span>
					</div>
				</div>
				<button
					type="button"
					onClick={limparMensagens}
					title="Reiniciar conversa"
					className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
				>
					<IconReload
						size={20}
						className="text-zinc-600 hover:rotate-180 transition-transform duration-300"
					/>
				</button>
			</div>
			{mensagens.length === 0 ? (
				<div className="flex flex-col justify-center items-center py-12 px-4 gap-3 min-h-[320px]">
					<IconMessages size={90} stroke={1} className="text-zinc-400" />
					<span className="text-lg font-semibold text-zinc-800">Vamos Conversar?</span>
					<span className="text-xs text-zinc-500 text-center max-w-[260px]">
						Tire dúvidas sobre projetos, stacks, formação e experiências.
					</span>
				</div>
			) : (
				<div className="flex flex-col p-2 gap-2 h-[45vh] min-h-[260] sm:h-[360] sm:max-h-[400] overflow-y-scroll">
					{mensagens.map((mensagem, i) => {
						const mesmoAutor = i > 0 && mensagens[i - 1].autor === mensagem.autor
						return (
							<BalaoMensagem
								key={mensagem.id}
								mensagem={mensagem}
								omitirAutor={mesmoAutor}
							/>
						)
					})}
					{pensando && (
						<Image src="/pensando.gif" alt="Pensando" width={50} height={50} />
					)}
					<div ref={fimChatRef} />
				</div>
			)}
			<div className="h-px bg-zinc-400 mt-4" />
			<div className="flex items-center gap-2 p-1 m-4 rounded-full h-10 bg-white">
				<input
					type="text"
					aria-label="Digite sua mensagem para o chat"
					placeholder="Digite sua mensagem..."
					value={texto}
					className="flex-1 bg-transparent h-8 outline-none pl-3 text-sm text-zinc-800 placeholder:text-zinc-400"
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						setTexto(e.target.value)
					}}
					onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
						if (e.key === "Enter") {
							enviarMensagem()
						}
					}}
				/>
				<button
					type="button"
					aria-label="Enviar mensagem"
					className="flex justify-center items-center min-h-8 min-w-8 rounded-full bg-blue-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
					onClick={enviarMensagem}
					disabled={!texto.trim()}
				>
					<IconSend className="text-white" size={18} />
				</button>
			</div>
		</div>
	)
}
