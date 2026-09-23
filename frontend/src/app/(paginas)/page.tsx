import Curriculo from "@/components/Curriculo"
import Principal from "@/components/landing/Principal"
import Projetos from "@/components/projetos/Projetos"
import Container from "@/components/shared/Container"
import { obterProjetos } from "@/functions/projetos"
import { obterTecnologias } from "@/functions/tecnologias"

export const revalidate = 3600

export default async function Home() {
	const tecnologias = await obterTecnologias()
	const projetos = await obterProjetos()

	return (
		<main className="w-full min-h-screen overflow-x-hidden">
			<Principal tecnologias={tecnologias.destaques} />
			<Container className="py-12 sm:py-16">
				<Curriculo />
			</Container>
			<Container className="py-12 sm:py-16 flex flex-col w-full">
				<Projetos titulo="Projetos" lista={projetos.todos} />
			</Container>
		</main>
	)
}


