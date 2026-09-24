import Mensagem from "@/model/Mensagem"
import ConteudoMD from "../shared/ConteudoMD"
import Image from "next/image"

export interface BalaoMensagemProps {
	mensagem: Mensagem
	omitirAutor?: boolean
}

export default function BalaoMensagem(props: BalaoMensagemProps) {
	return props.mensagem.lado === "esquerdo" ? (
		<BalaoEsquerdo {...props} />
	) : (
		<BalaoDireito {...props} />
	)
}

function BalaoEsquerdo(props: BalaoMensagemProps) {
	return (
		<div className="flex gap-2 sm:gap-3 items-start">
			{!props.omitirAutor && (
				<div className="shrink-0 self-start rounded-full bg-zinc-900/10 p-1 flex items-center justify-center">
					<Image
						src="/robot/frames/frame_315.webp"
						alt="AlonsoBot"
						width={28}
						height={28}
						className="object-contain sm:w-8 sm:h-8"
					/>
				</div>
			)}
			<div className={`flex flex-col max-w-[88%] sm:max-w-[85%] ${props.omitirAutor ? "pl-9 sm:pl-11" : ""}`}>
				{!props.omitirAutor && (
					<span className="text-[11px] sm:text-xs text-zinc-600 mb-0.5">
						{props.mensagem.autor === "ChatBot" ? "AlonsoBot" : (props.mensagem.autor || "AlonsoBot")}
					</span>
				)}
				<div className="bg-black text-white px-3.5 py-2 sm:px-5 sm:py-3 rounded-2xl sm:rounded-3xl rounded-tl-sm text-xs sm:text-sm leading-relaxed break-words overflow-x-auto">
					<ConteudoMD markdown={props.mensagem.texto} />
				</div>
			</div>
		</div>
	)
}

function BalaoDireito(props: BalaoMensagemProps) {
	return (
		<div className={`flex flex-col items-end ${props.omitirAutor ? "pr-1 sm:pr-2" : ""}`}>
			{!props.omitirAutor && (
				<span className="text-[11px] sm:text-xs text-zinc-600 mb-0.5">{props.mensagem.autor}</span>
			)}
			<div className="bg-blue-900 text-white px-3.5 py-2 sm:px-5 sm:py-3 max-w-[88%] sm:max-w-[85%] rounded-2xl sm:rounded-3xl rounded-tr-sm text-xs sm:text-sm leading-relaxed break-words">
				<ConteudoMD markdown={props.mensagem.texto} />
			</div>
		</div>
	)
}
