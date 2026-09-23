"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Menu() {
	const caminho = usePathname()

	return (
		<nav className="flex items-center gap-3 sm:gap-6">
			<MenuItem href="/" selecionado={caminho === "/"}>
				Início
			</MenuItem>
			<MenuItem
				href="/projeto"
				selecionado={caminho === "/projeto" || caminho === "/projeto/"}
			>
				Projetos
			</MenuItem>
			<MenuItem href="/experiencia" selecionado={caminho === "/experiencia"}>
				Experiência
			</MenuItem>
			<MenuItem
				href="mailto:rafaalonsomarques@hotmail.com"
				selecionado={false}
				className="hidden md:flex"
			>
				Contato
			</MenuItem>
		</nav>
	)
}

function MenuItem(props: {
	href: string
	children: React.ReactNode
	selecionado?: boolean
	novaAba?: boolean
	className?: string
}) {
	return (
		<Link
			href={props.href}
			target={props.novaAba ? "_blank" : "_self"}
			className={props.className}
		>
			<span
				className={`
                    flex items-center text-xs sm:text-sm md:text-base font-medium hover:text-white transition-colors whitespace-nowrap py-1
                    ${props.selecionado ? "border-b-2 sm:border-b-4 border-blue-500 text-white" : "text-zinc-300"}
                    `}
			>
				{props.children}
			</span>
		</Link>
	)
}
