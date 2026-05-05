import Link from "next/link"
import {
	IconBuildingSkyscraper,
	IconCalendarEvent,
	IconDeviceLaptop,
	IconTerminal2,
} from "@tabler/icons-react"
import Cabecalho from "@/components/shared/Cabecalho"
import Container from "@/components/shared/Container"

type ExperienciaItemProps = {
	cargo: string
	empresa: string
	periodo: string
	detalhes?: string[]
}

function ExperienciaItem(props: ExperienciaItemProps) {
	return (
		<article className="py-6 border-b border-zinc-800/80 last:border-b-0">
			<div className="flex items-start gap-3">
				<div className="flex-1">
					<div className="mt-2 flex items-center gap-2">
						<IconDeviceLaptop size={25} className="mt-1 text-zinc-500" />
						<h2 className="text-2xl sm:text-2xl font-semibold tracking-tight text-white">
							{props.cargo}
						</h2>
					</div>

					<div className="mt-2 flex items-center gap-2 text-zinc-400">
						<IconBuildingSkyscraper size={23} />
						<span className="text-base sm:text-lg">{props.empresa}</span>
					</div>

					<div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900/40 px-3 py-1.5">
						<IconCalendarEvent size={20} className="text-zinc-300" />
						<span className="text-sm sm:text-base text-zinc-200">{props.periodo}</span>
					</div>

					{props.detalhes && props.detalhes.length > 0 ? (
						<div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
							<div className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-200">
								{props.detalhes.map((detalhe) => (
									<p key={detalhe}>{detalhe}</p>
								))}
							</div>
						</div>
					) : null}
				</div>
			</div>
		</article>
	)
}

export default async function PaginaExperiencia() {
	return (
		<div className="min-h-screen bg-black text-zinc-100">
			<div className="relative h-16 overflow-hidden">
				<div className="absolute inset-x-0 top-0 h-[500] hero-bg" />
				<div className="relative z-10">
					<Cabecalho />
				</div>
			</div>

			<Container className="py-10 sm:py-14">
				<section className="w-full">
					<div className="mb-8 flex items-center justify-between gap-4">
						<h1 className="inline-flex items-center gap-2 text-3xl sm:text-4xl font-bold text-white">
							Experiências
							<IconTerminal2 size={30} className="text-zinc-200" />
						</h1>
					</div>

					<div>
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
								"Especializados em transformar ideias complexas em interfaces intuitivas e sistemas eficientes.Desenvolvemos aplicações web modernas com foco total em usabilidade, velocidade e segurança de dados. Do gerenciamento de usuários à integração com serviços externos, cuidamos de toda a camada tecnológica para que você possa focar no que realmente importa: o seu sucesso. Inovação, performance e compromisso com o resultado final em cada linha de entrega.",
							]}
						/>
					</div>
				</section>
			</Container>
		</div>
	)
}
