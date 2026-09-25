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
				{/* Header: Título, link clicável com contagem e controles */}
				<div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 w-full mb-4 md:mb-6">
					<div className="flex items-center gap-2.5 sm:gap-3.5">
						<h2 className="text-2xl sm:text-3xl font-bold text-white/85 tracking-tight">{props.titulo}</h2>
						<Link
							href="/projeto"
							title={`Ver todos os ${props.lista.length} projetos`}
							className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-zinc-900/90 hover:bg-blue-950/60 text-zinc-300 hover:text-blue-300 border border-zinc-700/70 hover:border-blue-500/50 transition-all duration-200 shadow-sm group"
						>
							<span>Ver os {props.lista.length} projetos</span>
							<IconArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
						</Link>
					</div>

					<div className="flex items-center gap-3">
						{/* Setas mobile */}
						<div className="flex md:hidden items-center gap-1.5">
							<CarouselPrevious className="static translate-x-0 translate-y-0 h-8 w-8 bg-zinc-900/90 border-zinc-700/80 hover:bg-zinc-800 text-white" />
							<CarouselNext className="static translate-x-0 translate-y-0 h-8 w-8 bg-zinc-900/90 border-zinc-700/80 hover:bg-zinc-800 text-white" />
						</div>
					</div>
				</div>

				{/* Lista do Carrossel - Somente Fotos dos Projetos */}
				<CarouselContent className="-ml-4 py-2">
					{props.lista.map((projeto) => {
						const imagemCapa = projeto.imagem?.[0]
						const linkExterno = (projeto.site && projeto.site.trim().length > 0)
							? projeto.site
							: ((projeto.repositorio && projeto.repositorio.trim().length > 0)
								? projeto.repositorio
								: null)
						const linkDestino = linkExterno || "/projeto"
						const isExterno = Boolean(linkExterno)

						return (
							<CarouselItem
								key={projeto.id}
								className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/3"
							>
								<Link
									href={linkDestino}
									target={isExterno ? "_blank" : undefined}
									rel={isExterno ? "noopener noreferrer" : undefined}
									aria-label={`Ver projeto ${projeto.nome}`}
									className="group relative block w-full aspect-video rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-zinc-600/90 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.8),0_0_24px_rgba(59,130,246,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
								>
									{imagemCapa ? (
										<Image
											src={imagemCapa}
											alt={`Demonstração do projeto ${projeto.nome}`}
											fill
											sizes="(max-width: 640px) 380px, (max-width: 1024px) 45vw, 360px"
											quality={75}
											className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
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

