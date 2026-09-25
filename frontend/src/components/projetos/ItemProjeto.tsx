import { Projeto } from "@core"
import Link from "next/link"
import Image from "next/image"
import { IconBrandGithub, IconExternalLink, IconWorld } from "@tabler/icons-react"

export interface ItemProjetoProps {
	projeto: Projeto
	className?: string
	priority?: boolean
}

function getTipoBadgeStyle(tipo: string) {
	const normalizado = (tipo || "").toLowerCase()

	if (normalizado.includes("backend")) {
		return {
			badge: "border-emerald-500/30 text-emerald-300 bg-emerald-500/10",
			dot: "bg-emerald-400 shadow-[0_0_8px_#34d399]",
		}
	}
	if (normalizado.includes("frontend")) {
		return {
			badge: "border-amber-500/30 text-amber-300 bg-amber-500/10",
			dot: "bg-amber-400 shadow-[0_0_8px_#fbbf24]",
		}
	}
	if (normalizado.includes("full")) {
		return {
			badge: "border-fuchsia-500/30 text-fuchsia-300 bg-fuchsia-500/10",
			dot: "bg-fuchsia-400 shadow-[0_0_8px_#e879f9]",
		}
	}
	if (normalizado.includes("mobile")) {
		return {
			badge: "border-sky-500/30 text-sky-300 bg-sky-500/10",
			dot: "bg-sky-400 shadow-[0_0_8px_#38bdf8]",
		}
	}
	if (normalizado.includes("jogo") || normalizado.includes("game")) {
		return {
			badge: "border-rose-500/30 text-rose-300 bg-rose-500/10",
			dot: "bg-rose-400 shadow-[0_0_8px_#fb7185]",
		}
	}
	return {
		badge: "border-zinc-700/60 text-zinc-300 bg-zinc-800/40",
		dot: "bg-zinc-400 shadow-[0_0_6px_#a1a1aa]",
	}
}

export default function ItemProjeto({ projeto, className = "", priority = false }: ItemProjetoProps) {
	const tipoEstilo = getTipoBadgeStyle(projeto.tipo)
	const tecnologias = projeto.tecnologias ?? []
	const imagemCapa = projeto.imagem?.[0]
	const temSite = Boolean(projeto.site && projeto.site.trim().length > 0)
	const temRepositorio = Boolean(projeto.repositorio && projeto.repositorio.trim().length > 0)
	const linkPrincipal = temSite ? projeto.site : (temRepositorio ? projeto.repositorio : undefined)

	return (
		<div
			className={`group relative flex flex-col h-full min-h-[500px] rounded-2xl border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-zinc-600/90 hover:bg-zinc-900/80 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.8),0_0_24px_rgba(59,130,246,0.12)] ${className}`}
		>
			{/* Efeito de iluminação radial no hover */}
			<div className="absolute inset-0 bg-gradient-to-b from-blue-500/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

			{/* Imagem de Capa do Projeto 100% limpa em proporção 16:9 */}
			<div className="relative w-full aspect-video shrink-0 overflow-hidden bg-zinc-900/90 border-b border-zinc-800/60">
				{linkPrincipal ? (
					<Link
						href={linkPrincipal}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`Ver ${projeto.nome}`}
						className="relative block w-full h-full"
					>
						{imagemCapa ? (
							<Image
								src={imagemCapa}
								alt={`Demonstração do projeto ${projeto.nome}`}
								fill
								sizes="(max-width: 640px) 380px, (max-width: 1024px) 45vw, 360px"
								quality={75}
								priority={priority}
								className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 text-zinc-600 font-mono text-xs">
								Sem imagem disponível
							</div>
						)}
					</Link>
				) : (
					imagemCapa ? (
						<Image
							src={imagemCapa}
							alt={`Demonstração do projeto ${projeto.nome}`}
							fill
							sizes="(max-width: 640px) 380px, (max-width: 1024px) 45vw, 360px"
							quality={75}
							priority={priority}
							className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 text-zinc-600 font-mono text-xs">
							Sem imagem disponível
						</div>
					)
				)}
			</div>

			{/* Informações internas completas sem cortes */}
			<div className="flex flex-col flex-1 p-5 justify-between gap-4">
				{/* Bloco Superior: Badges, Título e Descrição Completa */}
				<div className="flex flex-col gap-2.5">
					{/* Badge de Categoria */}
					<div className="h-6 flex items-center justify-between gap-2">
						<span
							className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium shadow-sm ${tipoEstilo.badge}`}
						>
							<span className={`h-1.5 w-1.5 rounded-full ${tipoEstilo.dot}`} />
							{projeto.tipo}
						</span>
					</div>

					{/* Título */}
					<h3 className="text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors line-clamp-1 min-h-[1.75rem] flex items-center">
						{linkPrincipal ? (
							<Link
								href={linkPrincipal}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:underline"
							>
								{projeto.nome}
							</Link>
						) : (
							projeto.nome
						)}
					</h3>

					{/* Descrição Completa (sem corte de texto) */}
					<p
						title={projeto.descricao}
						className="text-zinc-400 text-xs sm:text-sm leading-relaxed"
					>
						{projeto.descricao}
					</p>
				</div>

				{/* Bloco Inferior: Tecnologias e Rodapé */}
				<div className="flex flex-col gap-3 mt-auto pt-2">
					{/* Área de Tecnologias: todas 100% visíveis */}
					<div className="flex flex-wrap items-center gap-1.5">
						{tecnologias.length > 0 ? (
							tecnologias.map((tech) => (
								<span
									key={tech.id}
									className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium bg-zinc-900/90 border border-zinc-800/80 text-zinc-300 group-hover:border-zinc-700/80 transition-colors"
								>
									{tech.imagem && (
										<span className="relative w-3.5 h-3.5 shrink-0">
											<Image
												src={tech.imagem}
												alt={`Ícone de ${tech.nome}`}
												fill
												sizes="14px"
												className="object-contain"
											/>
										</span>
									)}
									<span>{tech.nome}</span>
								</span>
							))
						) : (
							<span className="text-xs text-zinc-600 font-mono">Sem tecnologias listadas</span>
						)}
					</div>

					{/* Rodapé / Links Ação */}
					<div className="pt-3 border-t border-zinc-800/70 flex flex-wrap items-center justify-between gap-2">
						<span className="text-xs font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors">
							{tecnologias.length} {tecnologias.length === 1 ? "tecnologia" : "tecnologias"}
						</span>

						<div className="flex items-center gap-2">
							{temSite && (
								<Link
									href={projeto.site!}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`Acessar site do projeto ${projeto.nome}`}
									className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 px-2.5 py-1 rounded-lg shadow-sm"
								>
									<IconWorld size={14} className="text-zinc-400" />
									<span>Site</span>
									<IconExternalLink size={12} className="text-zinc-500 hover:text-zinc-300" />
								</Link>
							)}

							{temRepositorio && (
								<Link
									href={projeto.repositorio!}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`Ver repositório do projeto ${projeto.nome} no GitHub`}
									className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 px-2.5 py-1 rounded-lg shadow-sm"
								>
									<IconBrandGithub size={14} className="text-zinc-400" />
									<span>Repositório</span>
									<IconExternalLink size={12} className="text-zinc-500 hover:text-zinc-300" />
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
