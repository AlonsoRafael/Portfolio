"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Tecnologia } from "@core"
import Cabecalho from "../shared/Cabecalho"
import Image from "next/image"
import NeuralBackground from "./NeuralBackground"

export interface PrincipalProps {
	tecnologias: Tecnologia[]
}

export default function Principal(props: PrincipalProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	const itemRefs = useRef<(HTMLSpanElement | null)[]>([])

	const [isHovered, setIsHovered] = useState(false)
	const [isDesktop, setIsDesktop] = useState(false)

	const tecnologiasList = props.tecnologias || []
	const flyingRefs = useRef<(HTMLDivElement | null)[]>([])
	const trailPositionsRef = useRef<Array<{ x: number; y: number }>>([])
	const originsRef = useRef<Array<{ x: number; y: number }>>([])
	const targetPosRef = useRef<{ x: number; y: number; isHovered: boolean }>({ x: 0, y: 0, isHovered: false })
	const animationFrameRef = useRef<number | null>(null)
	const isAnimatingRef = useRef<boolean>(false)

	useEffect(() => {
		const checkDesktop = () => {
			const fine = window.innerWidth >= 768 && window.matchMedia("(pointer: fine)").matches
			setIsDesktop(fine)
		}
		checkDesktop()
		window.addEventListener("resize", checkDesktop)
		return () => window.removeEventListener("resize", checkDesktop)
	}, [])

	// Captura as coordenadas de repouso na grade de cada tecnologia
	const updateOrigins = useCallback(() => {
		if (!containerRef.current) return
		const containerRect = containerRef.current.getBoundingClientRect()
		const origins = itemRefs.current.map((el) => {
			if (!el) return { x: containerRect.width / 2, y: containerRect.height * 0.75 }
			const r = el.getBoundingClientRect()
			return {
				x: r.left - containerRect.left + r.width / 2,
				y: r.top - containerRect.top + r.height / 2,
			}
		})

		if (origins.length > 0) {
			originsRef.current = origins
			if (trailPositionsRef.current.length === 0) {
				trailPositionsRef.current = origins.map((p) => ({ ...p }))
			}
		}
	}, [])

	// Loop de física ultra fluido a 60 FPS com manipulação direta de transform na GPU (sem React re-render)
	const startAnimationLoop = useCallback(() => {
		if (isAnimatingRef.current) return
		isAnimatingRef.current = true

		const updatePosition = () => {
			const origins = originsRef.current
			const currentTrail = trailPositionsRef.current
			const target = targetPosRef.current

			if (currentTrail.length > 0 && origins.length > 0) {
				let maxDelta = 0

				for (let i = 0; i < currentTrail.length; i++) {
					let destinationX: number
					let destinationY: number

					if (target.isHovered) {
						destinationX = i === 0 ? target.x : currentTrail[i - 1].x
						destinationY = i === 0 ? target.y : currentTrail[i - 1].y
					} else {
						const origin = origins[i] || { x: 0, y: 0 }
						destinationX = origin.x
						destinationY = origin.y
					}

					const factor = target.isHovered
						? Math.max(0.06, 0.12 - i * 0.006)
						: 0.16

					const dx = (destinationX - currentTrail[i].x) * factor
					const dy = (destinationY - currentTrail[i].y) * factor

					currentTrail[i].x += dx
					currentTrail[i].y += dy

					const dist = Math.abs(dx) + Math.abs(dy)
					if (dist > maxDelta) maxDelta = dist

					// Atualiza o elemento diretamente no DOM acelerado por GPU
					const el = flyingRefs.current[i]
					if (el) {
						const trailScale = Math.max(0.92, 1 - i * 0.012)
						const trailOpacity = Math.max(0.75, 1 - i * 0.035)
						el.style.transform = `translate3d(${currentTrail[i].x}px, ${currentTrail[i].y}px, 0) translate(-50%, -50%) scale(${trailScale})`
						el.style.opacity = `${trailOpacity}`
					}
				}

				// Para o loop quando retornar totalmente à vaga
				if (!target.isHovered && maxDelta < 0.15) {
					isAnimatingRef.current = false
					animationFrameRef.current = null
					return
				}
			}

			animationFrameRef.current = requestAnimationFrame(updatePosition)
		}

		animationFrameRef.current = requestAnimationFrame(updatePosition)
	}, [])

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!isDesktop || !containerRef.current) return
			if (originsRef.current.length === 0) {
				updateOrigins()
			}
			const rect = containerRef.current.getBoundingClientRect()
			const clientX = e.clientX - rect.left
			const clientY = e.clientY - rect.top

			const clampedY = Math.min(Math.max(92, clientY), rect.height - 30)
			const clampedX = Math.min(Math.max(30, clientX), rect.width - 30)

			targetPosRef.current = {
				x: clampedX,
				y: clampedY,
				isHovered: true,
			}

			if (!isHovered) {
				setIsHovered(true)
			}

			startAnimationLoop()
		},
		[isDesktop, isHovered, updateOrigins, startAnimationLoop]
	)

	const handleMouseLeave = useCallback(() => {
		if (!isDesktop) return
		targetPosRef.current.isHovered = false
		setIsHovered(false)
	}, [isDesktop])

	useEffect(() => {
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current)
				animationFrameRef.current = null
				isAnimatingRef.current = false
			}
		}
	}, [])

	return (
		<section
			ref={containerRef}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			className="relative overflow-hidden flex flex-col items-center justify-between min-h-[500px] h-[500px] w-full group cursor-default select-none bg-[#02112f]"
		>
			{/* Fundo Canvas 2D Interativo de Rede Neural */}
			<NeuralBackground />

			{/* Ícones das Tecnologias que voam da grade até o mouse (somente no desktop quando hovered) */}
			{isDesktop &&
				isHovered &&
				tecnologiasList.map((tecnologia, idx) => (
					<div
						key={tecnologia.id || idx}
						ref={(el) => {
							flyingRefs.current[idx] = el
						}}
						className="absolute top-0 left-0 pointer-events-none z-30 will-change-transform"
						style={{
							transform: "translate3d(0, 0, 0) translate(-50%, -50%)",
							opacity: 0,
						}}
					>
						<div className="relative h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 flex items-center justify-center bg-transparent">
							<div className="relative w-full h-full">
								<Image
									src={tecnologia.imagem}
									alt={tecnologia.nome}
									fill
									sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
									className="object-contain drop-shadow-md"
								/>
							</div>
						</div>
					</div>
				))}

			{/* Conteúdo principal */}
			<div className="relative z-10 w-full flex flex-col items-center justify-between flex-1 h-full">
				<div className="relative z-40 w-full">
					<Cabecalho />
				</div>
				<div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center py-2 sm:py-4 gap-3 sm:gap-4">
					<div className="flex flex-col items-center gap-1 sm:gap-1.5 text-center">
						<Image
							src="/foto_rafael.jpg"
							alt="Foto de Rafael Alonso Marques"
							width={176}
							height={176}
							sizes="(max-width: 640px) 112px, (max-width: 768px) 144px, 176px"
							quality={80}
							className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 aspect-square rounded-full object-cover object-center border-2 sm:border-3 border-white/85 shadow-xl shadow-black/50"
							priority
							fetchPriority="high"
						/>
						<h1 className="flex items-center justify-center px-2">
							<span className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white tracking-tight">
								Rafael Alonso Marques
							</span>
						</h1>
						<h2 className="text-zinc-200 text-center text-sm sm:text-base font-medium">Software Developer</h2>
						<div className="mt-1 flex flex-col items-center gap-1 text-zinc-300 text-xs sm:text-sm">
							<div className="flex items-center gap-1.5">
								<Image
									src="/capelo.png"
									alt="Ícone de formação"
									width={18}
									height={18}
									className="w-4 h-4 sm:w-4.5 sm:h-4.5 object-contain"
								/>
								<span>Sistemas de Informação - UFU</span>
							</div>
							<div className="flex items-center gap-1.5">
								<Image
									src="/travel.png"
									alt="Ícone de localização"
									width={18}
									height={18}
									className="w-4 h-4 sm:w-4.5 sm:h-4.5 object-contain"
								/>
								<span>Uberlândia - MG</span>
							</div>
						</div>
					</div>

					{/* Grade de Tecnologias Padrão com ícones renderizados no fluxo direto */}
					{tecnologiasList.length > 0 && (
						<div className="flex justify-center gap-3 sm:gap-4 md:gap-5 flex-wrap w-full max-w-4xl px-2 items-center">
							{tecnologiasList.map((tecnologia, idx) => (
								<div key={tecnologia.id || idx} className="flex flex-col items-center gap-1 sm:gap-1.5">
									<span
										ref={(el) => {
											itemRefs.current[idx] = el
										}}
										className="relative h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-2xl flex items-center justify-center"
									>
										{(!isDesktop || !isHovered) && (
											<div className="relative w-full h-full">
												<Image
													src={tecnologia.imagem}
													alt={tecnologia.nome}
													fill
													sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
													className="object-contain drop-shadow-md"
													priority={idx < 4}
												/>
											</div>
										)}
									</span>
									<span
										className={`text-[10px] sm:text-xs text-zinc-300 text-center whitespace-nowrap transition-all duration-300 ${
											isDesktop && isHovered ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"
										}`}
									>
										{tecnologia.nome}
									</span>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	)
}
