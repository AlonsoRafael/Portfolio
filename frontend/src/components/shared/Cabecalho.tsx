import Link from "next/link"
import Container from "./Container"
import Image from "next/image"
import Menu from "./Menu"
import { SocialHighlightCards } from "./SocialHighlightCards"

export default function Cabecalho() {
	return (
		<header className="w-full flex items-center h-16 bg-black/50">
			<Container className="flex-1 flex justify-between items-center px-3 sm:px-6">
				{/* Logo à esquerda */}
				<div className="flex items-center shrink-0">
					<Link href="/" aria-label="Página Inicial" className="unoptimized flex items-center">
						<Image
							src="/logo.gif"
							alt="Logo Rafael Alonso"
							width={120}
							height={40}
							className="w-16 sm:w-24 md:w-28 h-auto object-contain"
						/>
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
