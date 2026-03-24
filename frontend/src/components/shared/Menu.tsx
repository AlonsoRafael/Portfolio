"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Menu() {
	const caminho = usePathname()

	return (
		<nav className="flex gap-6">
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
			<MenuItem href="mailto:rafaalonsomarques@hotmail.com" selecionado={false}>
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
}) {
	return (
		<Link href={props.href} target={props.novaAba ? "_blank" : "_self"}>
			<span
				className={`
                    flex items-center gap-2 text-sm border-blue-950 hover:text-white
                    ${props.selecionado ? "border-b-4 text-white " : "text-zinc-300"}
                    `}
			>
				{props.children}
			</span>
		</Link>
	)
}
