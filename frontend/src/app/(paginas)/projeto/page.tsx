import Cabecalho from "@/components/shared/Cabecalho"
import Container from "@/components/shared/Container"
import { obterProjeto, obterProjetos } from "@/functions/projetos"
import Image from "next/image"
import Link from "next/link"

export const revalidate = 21600

function tipoVisual(tipo: string) {
	const normalizado = (tipo || "").toLowerCase()

	if (normalizado.includes("backend")) {
		return {
			dot: "bg-emerald-400",
			badge: "border-emerald-500/40 text-emerald-200 bg-emerald-500/10",
		}
	}

	if (normalizado.includes("frontend")) {
		return {
			dot: "bg-amber-400",
			badge: "border-amber-500/40 text-amber-200 bg-amber-500/10",
		}
	}

	if (normalizado.includes("full")) {
		return {
			dot: "bg-fuchsia-400",
			badge: "border-fuchsia-500/40 text-fuchsia-200 bg-fuchsia-500/10",
		}
	}

	if (normalizado.includes("mobile")) {
		return {
			dot: "bg-sky-400",
			badge: "border-sky-500/40 text-sky-200 bg-sky-500/10",
		}
	}

	return {
		dot: "bg-zinc-400",
		badge: "border-zinc-500/40 text-zinc-200 bg-zinc-500/10",
	}
}

function nivelTexto(nivel: string | number) {
	const mapa: Record<string, string> = {
		"1": "Iniciante",
		"2": "Intermediario",
		"3": "Avancado",
		"4": "Expert",
	}

	return mapa[String(nivel)] ?? "Nao informado"
}

export default async function PaginaProjetos() {
	const projetosBase = await obterProjetos()

	const detalhes = await Promise.all(
		projetosBase.todos.map(async (projeto) => {
			const completo = await obterProjeto(String(projeto.id))
			return completo ?? projeto
		}),
	)

	const lista = [...detalhes].sort((a, b) => {
		if (a.destaque !== b.destaque) return a.destaque ? -1 : 1
		return a.nome.localeCompare(b.nome)
	})

	return (
		<div className="min-h-screen bg-black text-zinc-100">
			<div className="relative h-16 overflow-hidden">
				<div className="absolute inset-x-0 top-0 h-[500] hero-bg" />
				<div className="relative z-10">
					<Cabecalho />
				</div>
			</div>

			<Container className="py-8 md:py-10">
				<h1 className="text-3xl md:text-3xl font-bold">Projetos</h1>
				<p className="text-zinc-400 mt-2">{lista.length} projetos organizados por tipo</p>
			</Container>

			<Container className="py-8 md:py-10">
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-5 items-stretch">
					{lista.map((projeto) => {
						const visual = tipoVisual(projeto.tipo)
						const tecnologias = projeto.tecnologias ?? []

						return (
							<article
								key={projeto.id}
								className="h-full rounded-xl border border-zinc-800 bg-zinc-950/80 p-5 flex flex-col gap-4 transition-all duration-200 hover:border-white hover:bg-zinc-950"
							>
								<div className="flex items-start justify-between gap-3 min-w-0">
									<h2 className="min-w-0 flex-1 text-[20px] leading-[1.05] font-extrabold tracking-tight text-white wrap-break-word">
										{projeto.nome}
									</h2>
									{projeto.destaque && (
										<span className="shrink-0 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-200">
											Destaque
										</span>
									)}
								</div>

								<div
									className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-sm ${visual.badge}`}
								>
									<span className={`h-2 w-2 rounded-full ${visual.dot}`} />
									{projeto.tipo}
								</div>

								<div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
									{tecnologias.length > 0 ? (
										<div className="grid grid-cols-4 gap-2">
											{tecnologias.slice(0, 8).map((tech) => (
												<div
													key={tech.id}
													title={tech.nome}
													className="rounded-md border border-zinc-700/80 bg-black/40 p-2 flex items-center justify-center"
												>
													<span className="relative block h-8 w-8">
														<Image
															src={tech.imagem}
															alt={tech.nome}
															fill
															className="object-contain"
														/>
													</span>
												</div>
											))}
										</div>
									) : (
										<p className="text-xs text-zinc-500">
											Sem tecnologias vinculadas
										</p>
									)}
								</div>

								<p className="text-zinc-300 leading-7 line-clamp-4 min-h-[112]">
									{projeto.descricao}
								</p>

								<div className="mt-auto pt-1 flex flex-col gap-1">
									<div className="text-xs text-zinc-400">
										{tecnologias.length} tecnologias
									</div>

									<div className="mt-auto pt-1 flex items-center gap-4 text-base font-semibold">
										<Link
											href={projeto.repositorio}
											target="_blank"
											rel="noopener noreferrer"
											className="text-white hover:text-blue-900 transition-colors"
										>
											Github ↗
										</Link>
									</div>
								</div>
							</article>
						)
					})}
				</div>
			</Container>
		</div>
	)
}
