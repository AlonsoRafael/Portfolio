import type { Metadata } from "next"
import Cabecalho from "@/components/shared/Cabecalho"
import Container from "@/components/shared/Container"
import { obterProjetos } from "@/functions/projetos"
import AsciiCursorBackground from "@/components/projetos/AsciiCursorBackground"
import NeuralBackground from "@/components/landing/NeuralBackground"
import ItemProjeto from "@/components/projetos/ItemProjeto"

export const revalidate = 60

export const metadata: Metadata = {
	title: "Projetos | Rafael Alonso - Software Developer",
	description:
		"Conheça os projetos desenvolvidos por Rafael Alonso, incluindo aplicações Full Stack, arquiteturas Back-end e interfaces Front-end modernas.",
	alternates: {
		canonical: "/projeto",
	},
}

export default async function PaginaProjetos() {
	const projetosBase = await obterProjetos()
	const lista = [...(projetosBase?.todos ?? [])].sort((a, b) => {
		if (a.destaque !== b.destaque) return a.destaque ? -1 : 1
		return a.nome.localeCompare(b.nome)
	})

	return (
		<div className="relative min-h-screen bg-black text-zinc-100 selection:bg-zinc-800 selection:text-white">
			{/* Fundo Interativo com Grid e Cursor Binário */}
			<AsciiCursorBackground />

			{/* Top bar com fundo de rede neural */}
			<div className="relative z-20 h-16 overflow-hidden bg-[#020617] border-b border-zinc-800/80">
				<NeuralBackground />
				<div className="relative z-10">
					<Cabecalho />
				</div>
			</div>

			<main className="relative z-10">
				<Container className="py-8 md:py-12">
					<div className="flex flex-col gap-2">
						<div className="flex flex-wrap items-baseline justify-between gap-4">
							<h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
								Projetos
							</h1>
							<span className="text-zinc-400 font-mono text-sm px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
								{lista.length} projetos desenvolvidos
							</span>
						</div>
					</div>
				</Container>

				<Container className="pb-20 pt-2">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 items-stretch">
						{lista.map((projeto, index) => (
							<ItemProjeto key={projeto.id} projeto={projeto} priority={index < 3} />
						))}
					</div>
				</Container>
			</main>
		</div>
	)
}
