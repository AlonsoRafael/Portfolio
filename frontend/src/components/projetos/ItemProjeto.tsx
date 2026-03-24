import { Projeto } from "@core"
import Link from "next/link"
import Image from "next/image"

export interface ItemProjetoProps {
	projeto: Projeto
}

export default function ItemProjeto(props: ItemProjetoProps) {
	return (
		<Link href={props.projeto.repositorio} target="_blank">
			<div
				className="
                    relative w-full aspect-video rounded-2xl overflow-x-hidden border border-zinc-800
                    "
			>
				<Image
					src={props.projeto.imagem[0]}
					alt={props.projeto.nome}
					fill
					sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
					className="object-cover object-center"
				/>
			</div>
		</Link>
	)
}
