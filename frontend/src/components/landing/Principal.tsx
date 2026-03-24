import { Tecnologia } from "@core"
import Cabecalho from "../shared/Cabecalho"
import Tecnologias from "../tecnologias/Tecnologias"
import Image from "next/image"

export interface PrincipalProps {
	tecnologias: Tecnologia[]
}

export default function Principal(props: PrincipalProps) {
	return (
		<div
			className=" 
            hero-bg flex flex-col items-center justify-center h-[500]
            "
		>
			<Cabecalho />
			<div className="flex-1 w-full flex flex-col items-center justify-center gap-5">
				<div className="flex flex-col items-center gap-1">
					<Image
						src="/minha-foto.jpeg"
						alt="Foto de Rafael Alonso Marques"
						width={800}
						height={800}
						sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 176px"
						quality={95}
						className="w-20 h-20  sm:w-28 sm:h-28 md:w-44 md:h-44 rounded-full object-cover object-[center_60%] border-2 border-white/80 shadow-lg"
						priority
					/>
					<h1 className="flex items-center gap-3">
						<span className="w-2 h-2 rounded-full bg-blue-900"></span>
						<span className="text-3xl sm:text-4xl font-bold text-center text-white">
							Rafael Alonso Marques
						</span>
						<span className="w-2 h-2 rounded-full bg-blue-900"></span>
					</h1>
					<h2 className="text-zinc-300 text-center">Software Developer</h2>
					<div className="mt-1 flex items-center gap-2 text-zinc-300 text-sm sm:text-base">
						<Image
							src="/capelo.png"
							alt="Ícone de formação"
							width={18}
							height={18}
							className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
						/>
						<span>Sistemas de Informação - UFU</span>
					</div>
					<div className="mt-1 flex items-center gap-2 text-zinc-300 text-sm sm:text-base">
						<Image
							src="/travel.png"
							alt="Ícone de localização"
							width={18}
							height={18}
							className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
						/>
						<span>Uberlândia - MG</span>
					</div>
				</div>
				<Tecnologias lista={props.tecnologias} />
			</div>
		</div>
	)
}
