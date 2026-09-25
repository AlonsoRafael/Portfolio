import type { Metadata, Viewport } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"

const fonte = Montserrat({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-sans",
})

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	interactiveWidget: "resizes-content",
}

export const metadata: Metadata = {
	title: "Rafael Alonso | Portfólio",
	description:
		"Portfólio de Rafael Alonso, desenvolvedor Front-end e Back-end com foco em Java (Spring Boot), Python, Next.js, NestJS, React.js e TypeScript. Projetos reais, experiências e soluções web modernas.",
	metadataBase: new URL("https://alonsotech.vercel.app"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: "Rafael Alonso | Portfólio",
		description:
			"Portfólio de Rafael Alonso Marques. Desenvolvedor Full Stack especializado em React, Next.js, Java e Python.",
		type: "website",
		locale: "pt_BR",
		url: "https://alonsotech.vercel.app",
		siteName: "Rafael Alonso | Software Developer",
		images: [
			{
				url: "/logo.png",
				width: 435,
				height: 435,
				alt: "Rafael Alonso",
				type: "image/png",
			},
		],
	},
	twitter: {
		card: "summary",
		title: "Rafael Alonso | Software Developer",
		description:
			"Portfólio de Rafael Alonso Marques. Desenvolvedor Full Stack especializado em React, Next.js, Java e Python.",
		images: ["/logo.png"],
	},
	robots: {
		index: true,
		follow: true,
	},
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/logo.png", type: "image/png" },
		],
		shortcut: "/favicon.ico",
		apple: "/logo.png",
	},
}

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "Person",
	name: "Rafael Alonso Marques",
	url: "https://alonsotech.vercel.app",
	image: "https://alonsotech.vercel.app/logo.png",
	jobTitle: "Software Developer",
	alumniOf: {
		"@type": "EducationalOrganization",
		name: "Universidade Federal de Uberlândia (UFU)",
	},
	sameAs: [
		"https://github.com/AlonsoRafael",
		"https://www.linkedin.com/in/alonso-rafael",
	],
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="pt-BR" className={fonte.variable}>
			<head>
				<link rel="preconnect" href="https://raw.githubusercontent.com" crossOrigin="anonymous" />
				<link rel="dns-prefetch" href="https://raw.githubusercontent.com" />
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
				/>
			</head>
			<body className={`${fonte.className} antialiased min-h-screen bg-black text-white`}>
				{children}
			</body>
		</html>
	)
}
