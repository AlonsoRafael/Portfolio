import Link from "next/link"
import Container from "./Container"
import Image from "next/image"
import Menu from "./Menu"

export default function Cabecalho() {
	return (
		<header className="w-full flex items-center h-16 bg-black/50">
			<Container className="flex-1 flex justify-center sm:justify-between items-center">
				<div className="flex items-center gap-10">
					<Link href="/" className="hidden sm:block unoptimized ">
						<Image src="/logo.gif" alt="Logo" width={120} height={40} />
					</Link>
					<Menu />
				</div>
				<div className="hidden sm:flex items-center">
					<Link
						href="https://www.linkedin.com/in/rafael-alonso-5b5099207/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image src="/linkedin.svg" alt="LinkedIn" width={36} height={36} />
					</Link>

					<Link
						href="https://github.com/AlonsoRafael"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="GitHub"
					>
						<Image src="/github.svg" alt="GitHub" width={36} height={36} />
					</Link>
				</div>
			</Container>
		</header>
	)
}
