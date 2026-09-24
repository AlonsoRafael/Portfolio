"use client"
import useChat from "@/hooks/useChat"
import { IconMessages, IconReload, IconSend } from "@tabler/icons-react"
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react"
import BalaoMensagem from "./balaoMensagem"
import Image from "next/image"

export default function JanelaChat() {
	const { mensagens, pensando, adicionarMensagem, limparMensagens } = useChat()
	const [texto, setTexto] = useState("")
	const [viewportHeight, setViewportHeight] = useState<number | null>(null)
	const fimChatRef = useRef<HTMLDivElement>(null)

	function enviarMensagem() {
		const textoLimpo = texto.trim()
		if (!textoLimpo) return
		adicionarMensagem(texto)
		setTexto("")
	}

	const scrollToBottom = (smooth = true) => {
		const fim = fimChatRef.current
		const lista = fim?.parentElement
		if (!lista) return
		lista.scrollTo({
			top: lista.scrollHeight,
			behavior: smooth ? "smooth" : "auto",
		})
	}

	useEffect(() => {
		scrollToBottom(true)
	}, [mensagens, pensando])

	useEffect(() => {
		if (typeof window === "undefined") return

		const handleViewportChange = () => {
			if (window.visualViewport) {
				setViewportHeight(window.visualViewport.height)
			}
		}

		handleViewportChange()

		const vv = window.visualViewport
		if (vv) {
			vv.addEventListener("resize", handleViewportChange)
			vv.addEventListener("scroll", handleViewportChange)
		}
		window.addEventListener("resize", handleViewportChange)

		return () => {
			if (vv) {
				vv.removeEventListener("resize", handleViewportChange)
				vv.removeEventListener("scroll", handleViewportChange)
			}
			window.removeEventListener("resize", handleViewportChange)
		}
	}, [])

	const handleInputFocus = () => {
		setTimeout(() => {
			scrollToBottom(true)
		}, 150)
	}

	// Quando o teclado virtual abre no mobile (viewportHeight diminui), ajustamos para caber perfeitamente na tela visível
	const isKeyboardOpen = viewportHeight !== null && typeof window !== "undefined" && viewportHeight < window.innerHeight * 0.75
	const dynamicHeightStyle = viewportHeight
		? isKeyboardOpen
			? { maxHeight: `${Math.max(220, viewportHeight - 16)}px`, height: `${Math.max(220, viewportHeight - 16)}px` }
			: { maxHeight: `${Math.min(460, viewportHeight - 30)}px` }
		: undefined

	return (
		<div
			className="flex flex-col bg-zinc-200 rounded-2xl text-black overflow-hidden shadow-2xl border border-zinc-300 w-full h-[50dvh] min-h-[310px] sm:h-[400px] md:h-[430px] max-h-[460px]"
			style={dynamicHeightStyle}
		>
			{/* Header */}
			<div className="shrink-0 flex justify-between items-center bg-white px-3.5 py-2.5 sm:px-4 sm:py-2.5 border-b border-zinc-200">
				<div className="flex items-center gap-2 sm:gap-2.5">
					<div className="relative">
						<Image
							src="/robot/frames/frame_315.webp"
							alt="AlonsoBot"
							width={30}
							height={30}
							className="object-contain sm:w-8 sm:h-8"
						/>
						<span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
					</div>
					<div>
						<h2 className="text-sm sm:text-base font-bold leading-tight">AlonsoBot</h2>
						<span className="text-[11px] sm:text-xs text-emerald-600 font-medium">Online</span>
					</div>
				</div>
				<button
					type="button"
					onClick={limparMensagens}
					title="Reiniciar conversa"
					className="p-1 sm:p-1.5 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer text-zinc-600 hover:text-zinc-900"
				>
					<IconReload
						size={18}
						className="sm:w-5 sm:h-5 hover:rotate-180 transition-transform duration-300"
					/>
				</button>
			</div>

			{/* Mensagens / Conteúdo */}
			{mensagens.length === 0 ? (
				<div className="flex-1 flex flex-col justify-center items-center py-5 sm:py-8 px-4 gap-2 min-h-0 overflow-y-auto">
					<IconMessages size={46} stroke={1.2} className="text-zinc-400 sm:w-14 sm:h-14" />
					<span className="text-sm sm:text-base font-semibold text-zinc-800 text-center">
						Vamos Conversar?
					</span>
					<span className="text-[11px] sm:text-xs text-zinc-500 text-center max-w-[240px] leading-relaxed">
						Tire dúvidas sobre projetos, stacks, formação e experiências.
					</span>
				</div>
			) : (
				<div className="flex-1 min-h-0 flex flex-col p-2.5 sm:p-3 gap-2 overflow-y-auto overscroll-contain">
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
						<div className="flex items-center gap-2 pl-2">
							<Image src="/pensando.gif" alt="Pensando" width={36} height={36} />
						</div>
					)}
					<div ref={fimChatRef} />
				</div>
			)}

			{/* Separador */}
			<div className="shrink-0 h-px bg-zinc-300" />

			{/* Input */}
			<div className="shrink-0 p-2.5 sm:p-3 bg-zinc-200">
				<div className="flex items-center gap-2 p-1 rounded-full bg-white border border-zinc-300 shadow-sm focus-within:border-blue-700 transition-colors">
					<input
						type="text"
						aria-label="Digite sua mensagem para o chat"
						placeholder="Digite sua mensagem..."
						value={texto}
						onFocus={handleInputFocus}
						className="flex-1 bg-transparent h-8 sm:h-9 outline-none pl-3 text-base sm:text-sm text-zinc-800 placeholder:text-zinc-400 min-w-0"
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
						className="flex justify-center items-center h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-blue-900 hover:bg-blue-800 active:scale-95 transition-all text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
						onClick={enviarMensagem}
						disabled={!texto.trim()}
					>
						<IconSend size={16} className="sm:w-[18px] sm:h-[18px]" />
					</button>
				</div>
			</div>
		</div>
	)
}
