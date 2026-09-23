import Link from "next/link"
import Container from "./Container"
import Image from "next/image"
import Menu from "./Menu"
import { SocialHighlightCards } from "./SocialHighlightCards"

export default function Cabecalho() {
	return (
		<header className="w-full flex items-center h-16 bg-black/50">
			<Container className="flex-1 flex justify-between items-center px-3 sm:px-6">
				{/* Logo à esquerda com efeito scanner reveal */}
				<div className="flex items-center shrink-0">
					<Link
						href="/"
						aria-label="Página Inicial"
						className="group flex items-center transition-transform duration-300 hover:scale-105"
					>
						<div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center">
							{/* Camada base: sempre visível para nunca ficar vazio */}
							<Image
								src="/logo.svg"
								alt="Logo Rafael Alonso"
								width={40}
								height={40}
								className="w-full h-full object-contain opacity-35"
								priority
							/>
							{/* Camada ativa: varredura 100% contínua */}
							<Image
								src="/logo.svg"
								alt=""
								width={40}
								height={40}
								className="absolute inset-0 w-full h-full object-contain animate-logo-reveal"
								priority
							/>
						</div>
					</Link>
				</div>

				{/* Menu centralizado */}
				<div className="flex items-center justify-center px-1 sm:px-2">
					<Menu />
				</div>

				{/* Ícones sociais à direita */}
				<div className="flex items-center shrink-0">
					<SocialHighlightCards />
				</div>
			</Container>
		</header>
	)
}
