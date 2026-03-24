import type { Metadata } from "next"
import { Montserrat, Geist } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
	title: "Rafael Alonso | Portifolio",
	description:
		"Portfólio de Rafael Alonso, desenvolvedor Frond-end e Back-end com foco em Java (Spring Boot), Python, Next.js, NestJS React.js e TypeScript. Projetos reais, experiências e soluções web modernas.",
}

const fonte = Montserrat({
	subsets: ["latin"],
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="pt-BR" className={cn("font-sans", geist.variable)}>
			<body className={`${fonte.className} antialiased`}>{children}</body>
		</html>
	)
}
