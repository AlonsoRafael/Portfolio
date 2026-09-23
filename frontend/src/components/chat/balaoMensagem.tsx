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
		<div className="flex gap-4">
			{!props.omitirAutor && (
				<div className="shrink-0 self-start rounded-full bg-zinc-900/10 p-1 flex items-center justify-center">
					<Image
						src="/robot/frames/frame_315.webp"
						alt="AlonsoBot"
						width={36}
						height={36}
						className="object-contain"
					/>
				</div>
			)}
			<div className={`flex flex-col ${props.omitirAutor && "pl-16"}`}>
				{!props.omitirAutor && (
					<span className="text-xs text-zinc-600">
						{props.mensagem.autor === "ChatBot" ? "AlonsoBot" : (props.mensagem.autor || "AlonsoBot")}
					</span>
				)}
				<div className="bg-black text-white px-7 py-4 sm:w-80 rounded-r-3xl rounded-bl-3xl">
					<ConteudoMD markdown={props.mensagem.texto} />
				</div>
			</div>
		</div>
	)
}

function BalaoDireito(props: BalaoMensagemProps) {
	return (
		<div className={`flex flex-col items-end ${props.omitirAutor && "pr-2"}`}>
			{!props.omitirAutor && (
				<span className="text-xs text-zinc-600">{props.mensagem.autor}</span>
			)}
			<div className="bg-blue-900 text-white px-7 py-4 sm:w-80 rounded-l-3xl rounded-br-3xl">
				<ConteudoMD markdown={props.mensagem.texto} />
			</div>
		</div>
	)
}
