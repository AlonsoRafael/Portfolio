import type { Metadata } from "next"
import {
	IconBuildingSkyscraper,
	IconCalendarEvent,
	IconDeviceLaptop,
	IconTerminal2,
} from "@tabler/icons-react"
import Cabecalho from "@/components/shared/Cabecalho"
import Container from "@/components/shared/Container"
import AsciiCursorBackground from "@/components/projetos/AsciiCursorBackground"
import NeuralBackground from "@/components/landing/NeuralBackground"

export const metadata: Metadata = {
	title: "Experiências | Rafael Alonso - Software Developer",
	description:
		"Histórico profissional e atuações de destaque de Rafael Alonso em desenvolvimento de software, pesquisa em inteligência artificial e soluções tecnológicas.",
	alternates: {
		canonical: "/experiencia",
	},
}

type ExperienciaItemProps = {
	cargo: string
	empresa: string
	periodo: string
	detalhes?: string[]
}

function ExperienciaItem(props: ExperienciaItemProps) {
	return (
		<article className="rounded-2xl border border-zinc-800/90 bg-zinc-950/80 backdrop-blur-md p-6 sm:p-7 flex flex-col gap-4 transition-all duration-300 hover:border-zinc-500 hover:bg-zinc-900/90 hover:shadow-[0_0_25px_rgba(255,255,255,0.06)] hover:-translate-y-0.5">
			<div className="flex flex-col gap-2">
				<div className="flex items-center gap-2.5">
					<IconDeviceLaptop size={24} className="text-zinc-400 shrink-0" aria-hidden="true" />
					<h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
						{props.cargo}
					</h2>
				</div>

				<div className="flex items-center gap-2 text-zinc-400 font-mono text-sm sm:text-base">
					<IconBuildingSkyscraper size={20} className="shrink-0 text-zinc-500" aria-hidden="true" />
					<span>{props.empresa}</span>
				</div>

				<div className="mt-1 inline-flex w-fit items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1 font-mono text-xs text-zinc-300">
					<IconCalendarEvent size={15} className="text-zinc-400" aria-hidden="true" />
					<span>{props.periodo}</span>
				</div>
			</div>

			{props.detalhes && props.detalhes.length > 0 ? (
				<div className="mt-1 rounded-xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm p-4 sm:p-5">
					<div className="space-y-3 text-sm sm:text-base leading-relaxed text-zinc-300">
						{props.detalhes.map((detalhe) => (
							<p key={detalhe}>{detalhe}</p>
						))}
					</div>
				</div>
			) : null}
		</article>
	)
}

export default async function PaginaExperiencia() {
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
				<Container className="py-8 md:py-10">
					<section className="w-full">
						<div className="mb-8">
							<h1 className="inline-flex items-center gap-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
								Experiências
								<IconTerminal2 size={32} className="text-zinc-300" aria-hidden="true" />
							</h1>
						</div>

						<div className="flex flex-col gap-6 pb-16">
							<ExperienciaItem
								cargo="Desenvolvedor de Software"
								empresa="Projeto OptiColorRT (UFU/FAPEMIG), Uberlândia"
								periodo="jan de 2025 – jul de 2025"
								detalhes={[
									"Responsável pelo desenvolvimento de uma solução de software de alta precisão técnica, focada em performance e confiabilidade. O projeto resultou em um produto sólido de inovação tecnológica, culminando no registro oficial de propriedade intelectual junto ao INPI. Atuação em todo o ciclo de vida do software, garantindo padrões de qualidade exigidos para certificação e proteção institucional.",
								]}
							/>

							<ExperienciaItem
								cargo="Bolsista de Iniciação Científica (PIBIC/CNPq)"
								empresa="UFU, Uberlândia"
								periodo="jan de 2024 – jan de 2025"
								detalhes={[
									"Atuação no desenvolvimento de arquiteturas baseadas em modelos de linguagem (LLMs) para a automação de processos complexos de programação. Foco na orquestração de agentes inteligentes e engenharia de contextos para otimizar o ciclo de desenvolvimento de software, transformando requisitos lógicos em execuções técnicas automatizadas com alta precisão.",
								]}
							/>

							<ExperienciaItem
								cargo="Alonso Tech"
								empresa="PJ"
								periodo="fev de 2024 - presente"
								detalhes={[
									"Especializados em transformar ideias complexas em interfaces intuitivas e sistemas eficientes. Desenvolvemos aplicações web modernas com foco total em usabilidade, velocidade e segurança de dados. Do gerenciamento de usuários à integração com serviços externos, cuidamos de toda a camada tecnológica para que você possa focar no que realmente importa: o seu sucesso. Inovação, performance e compromisso com o resultado final em cada linha de entrega.",
								]}
							/>
						</div>
					</section>
				</Container>
			</main>
		</div>
	)
}


