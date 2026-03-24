import Curriculo from "@/components/Curriculo"
import Principal from "@/components/landing/Principal"
import Projetos from "@/components/projetos/Projetos"
import Container from "@/components/shared/Container"
import { obterProjetos } from "@/functions/projetos"
import { obterTecnologias } from "@/functions/tecnologias"

export default async function Home() {
	const tecnologias = await obterTecnologias()
	const projetos = await obterProjetos()

	return (
		<div>
			<Principal tecnologias={tecnologias.destaques} />
			<Container className="py-16">
				<Curriculo tecnologias={tecnologias.todas} />
			</Container>
			<Container className="py-16 flex flex-col items-center gap-10">
				<Projetos titulo="Projetos" lista={projetos.todos} />
			</Container>
		</div>
	)
}
