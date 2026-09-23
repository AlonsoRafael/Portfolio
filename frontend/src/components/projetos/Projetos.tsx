"use client"

import { Projeto } from "@core"
import Link from "next/link"
import Image from "next/image"
import { IconArrowRight, IconExternalLink } from "@tabler/icons-react"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../ui/carousel"

export interface ProjetosProps {
	titulo: string
	lista: Projeto[]
}

export default function Projetos(props: ProjetosProps) {
	return (
		<div className="w-full flex flex-col gap-6">
			<Carousel
				opts={{
					align: "start",
					loop: true,
				}}
				className="w-full relative md:px-12"
			>
				{/* Header: Título, contador e link para página de projetos */}
				<div className="flex items-center justify-between w-full mb-4 md:mb-6">
					<div className="flex items-center gap-3">
						<h2 className="text-2xl sm:text-3xl font-bold text-white/85 tracking-tight">{props.titulo}</h2>
						<span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/60 font-mono">
							{props.lista.length}
						</span>
					</div>

					<div className="flex items-center gap-3">
						<Link
							href="/projeto"
							className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors group"
						>
							<span>Ver todos</span>
							<IconArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
						</Link>

						{/* Setas mobile */}
						<div className="flex md:hidden items-center gap-1.5">
							<CarouselPrevious className="static translate-x-0 translate-y-0 h-8 w-8 bg-zinc-900/90 border-zinc-700/80 hover:bg-zinc-800 text-white" />
							<CarouselNext className="static translate-x-0 translate-y-0 h-8 w-8 bg-zinc-900/90 border-zinc-700/80 hover:bg-zinc-800 text-white" />
						</div>
					</div>
				</div>

				{/* Lista do Carrossel - Somente Fotos dos Projetos */}
				<CarouselContent className="-ml-4 py-2">
					{props.lista.map((projeto, index) => {
						const imagemCapa = projeto.imagem?.[0]

						return (
							<CarouselItem
								key={projeto.id}
								className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/3"
							>
								<Link
									href={projeto.repositorio || "/projeto"}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`Ver projeto ${projeto.nome}`}
									className="group relative block w-full aspect-video rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-zinc-600/90 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.8),0_0_24px_rgba(59,130,246,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
								>
									{imagemCapa ? (
										<Image
											src={imagemCapa}
											alt={`Demonstração do projeto ${projeto.nome}`}
											fill
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
											quality={80}
											className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 text-zinc-600 font-mono text-xs">
											Sem imagem disponível
										</div>
									)}

									{/* Gradiente e identificação sutil no hover */}
									<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
										<div className="flex items-center justify-between w-full">
											<span className="text-sm font-semibold text-white truncate drop-shadow-md">
												{projeto.nome}
											</span>
											<div className="h-7 w-7 rounded-full bg-zinc-900/90 border border-zinc-700/80 flex items-center justify-center text-zinc-300 group-hover:text-white shrink-0 ml-2 shadow-sm">
												<IconExternalLink size={14} />
											</div>
										</div>
									</div>
								</Link>
							</CarouselItem>
						)
					})}
				</CarouselContent>

				{/* Setas de navegação desktop */}
				<CarouselPrevious className="hidden md:flex -left-4 lg:-left-6 top-1/2 -translate-y-1/2 bg-zinc-900/95 border-zinc-700/80 hover:bg-zinc-800 hover:border-zinc-500 text-white z-10 h-10 w-10 shadow-lg shadow-black/50" />
				<CarouselNext className="hidden md:flex -right-4 lg:-right-6 top-1/2 -translate-y-1/2 bg-zinc-900/95 border-zinc-700/80 hover:bg-zinc-800 hover:border-zinc-500 text-white z-10 h-10 w-10 shadow-lg shadow-black/50" />
			</Carousel>
		</div>
	)
}

