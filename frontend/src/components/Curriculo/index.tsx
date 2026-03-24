import Link from "next/link"
import { Tecnologia } from "@core"
import { IconExternalLink } from "@tabler/icons-react"

export interface CurriculoProps {
	tecnologias: Tecnologia[]
}

export default function Curriculo(props: CurriculoProps) {
	return (
		<section
			className="
   				 w-full rounded-md border border-zinc-800 px-6 py-8 sm:px-9
    			transition-all duration-300
   				hover:border-white
  				"
		>
			<h3 className="text-2xl font-bold text-white/70">Sobre</h3>

			<p className="mt-5 max-w-6xl leading-relaxed text-zinc-300 text-sm sm:text-base">
				Especialista em desenvolvimento de sistemas escaláveis, com foco em arquiteturas
				eficientes e interfaces responsivas. Minha atuação abrange desde o Front-end moderno
				até o Back-end robusto, utilizando Java (Spring Boot), Python, React.js e Next.js.
				Busco transformar desafios de negócio em soluções reais, unindo a agilidade do
				desenvolvimento com a qualidade e a inovação tecnológica. Com uma abordagem centrada
				no usuário, estou sempre em busca de aprimorar a experiência digital, entregando
				produtos que sejam não apenas funcionais, mas também intuitivos e impactantes.
			</p>

			<Link
				href="/experiencias"
				className="mt-8 inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-blue-900 underline decoration-zinc-700 underline-offset-4 hover:text-blue-400"
			>
				<span>Experiências</span>
				<IconExternalLink size={18} stroke={2} />
			</Link>
		</section>
	)
}
