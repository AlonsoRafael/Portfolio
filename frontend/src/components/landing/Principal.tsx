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

	const [targetPos, setTargetPos] = useState({ x: 0, y: 0, isHovered: false })

	const tecnologiasList = props.tecnologias || []
	const [trailPositions, setTrailPositions] = useState<Array<{ x: number; y: number }>>([])
	const trailPositionsRef = useRef<Array<{ x: number; y: number }>>([])
	const originsRef = useRef<Array<{ x: number; y: number }>>([])
	const animationFrameRef = useRef<number | null>(null)
	const isAnimatingRef = useRef<boolean>(false)

	// Captura as coordenadas de repouso na grade de cada tecnologia apenas sob demanda (resize / layout)
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
			if (!targetPos.isHovered && trailPositionsRef.current.length === 0) {
				trailPositionsRef.current = origins
				setTrailPositions(origins)
			}
		}
	}, [targetPos.isHovered])

	// Inicializa e monitora mudanças de tamanho de tela/layout sem reflows desnecessários
	useEffect(() => {
		updateOrigins()
		const timer1 = setTimeout(updateOrigins, 60)
		const timer2 = setTimeout(updateOrigins, 250)

		window.addEventListener("resize", updateOrigins)

		let resizeObserver: ResizeObserver | null = null
		if (containerRef.current && typeof ResizeObserver !== "undefined") {
			resizeObserver = new ResizeObserver(() => {
				updateOrigins()
			})
			resizeObserver.observe(containerRef.current)
		}

		return () => {
			clearTimeout(timer1)
			clearTimeout(timer2)
			window.removeEventListener("resize", updateOrigins)
			if (resizeObserver) resizeObserver.disconnect()
		}
	}, [tecnologiasList.length, updateOrigins])

	// Loop de física suave dos ícones com parada automática quando em repouso (zero reflows)
	const startAnimationLoop = useCallback(() => {
		if (isAnimatingRef.current) return
		isAnimatingRef.current = true

		const updatePosition = () => {
			const origins = originsRef.current
			if (trailPositionsRef.current.length > 0 && origins.length > 0) {
				const updated = [...trailPositionsRef.current]
				let maxDelta = 0

				for (let i = 0; i < updated.length; i++) {
					let destinationX: number
					let destinationY: number

					if (targetPos.isHovered) {
						// Voo em direção ao mouse em fila indiana
						destinationX = i === 0 ? targetPos.x : updated[i - 1].x
						destinationY = i === 0 ? targetPos.y : updated[i - 1].y
					} else {
						// Retorno suave para a respectiva vaga na grade
						const origin = origins[i] || { x: 0, y: 0 }
						destinationX = origin.x
						destinationY = origin.y
					}

					// Fator de fluidez para os ícones
					const factor = targetPos.isHovered
						? Math.max(0.04, 0.08 - i * 0.005)
						: 0.12 // Retorno suave para a grade

					const dx = (destinationX - updated[i].x) * factor
					const dy = (destinationY - updated[i].y) * factor

					updated[i] = {
						x: updated[i].x + dx,
						y: updated[i].y + dy,
					}

					const dist = Math.abs(destinationX - updated[i].x) + Math.abs(destinationY - updated[i].y)
					if (dist > maxDelta) maxDelta = dist
				}

				trailPositionsRef.current = updated
				setTrailPositions(updated)

				// Para o loop de animação quando os ícones já retornaram ao repouso
				if (!targetPos.isHovered && maxDelta < 0.2) {
					trailPositionsRef.current = origins
					setTrailPositions(origins)
					isAnimatingRef.current = false
					animationFrameRef.current = null
					return
				}
			}

			animationFrameRef.current = requestAnimationFrame(updatePosition)
		}

		animationFrameRef.current = requestAnimationFrame(updatePosition)
	}, [targetPos])

	useEffect(() => {
		startAnimationLoop()
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current)
				animationFrameRef.current = null
				isAnimatingRef.current = false
			}
		}
	}, [startAnimationLoop])

	const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		if (!containerRef.current) return
		const rect = containerRef.current.getBoundingClientRect()
		const clientX = e.clientX - rect.left
		const clientY = e.clientY - rect.top

		// Mantém os ícones seguindo o mouse no eixo X, travando a altura Y logo abaixo da top bar
		const clampedY = Math.min(Math.max(92, clientY), rect.height - 30)
		const clampedX = Math.min(Math.max(30, clientX), rect.width - 30)

		setTargetPos({
			x: clampedX,
			y: clampedY,
			isHovered: true,
		})
	}, [])

	const handleMouseLeave = useCallback(() => {
		setTargetPos((prev) => ({
			...prev,
			isHovered: false,
		}))
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
			{/* Ícones das Tecnologias que voam da grade até o mouse */}
			{tecnologiasList.map((tecnologia, idx) => {
				const pos = trailPositions[idx]
				if (!pos) return null

				const trailScale = targetPos.isHovered ? Math.max(0.92, 1 - idx * 0.012) : 1
				const trailOpacity = targetPos.isHovered ? Math.max(0.75, 1 - idx * 0.035) : 1

				return (
					<div
						key={tecnologia.id || idx}
						className="absolute top-0 left-0 pointer-events-none z-30 will-change-transform transition-[opacity,box-shadow,border-color] duration-300"
						style={{
							transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) scale(${trailScale})`,
							opacity: trailOpacity,
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
				)
			})}

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
							width={400}
							height={400}
							sizes="(max-width: 640px) 224px, (max-width: 768px) 288px, 352px"
							quality={95}
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

					{/* Grade de Tecnologias Padrão com ícones responsivos */}
					{tecnologiasList.length > 0 && (
						<div className="flex justify-center gap-3 sm:gap-4 md:gap-5 flex-wrap w-full max-w-4xl px-2 items-center">
							{tecnologiasList.map((tecnologia, idx) => (
								<div key={tecnologia.id || idx} className="flex flex-col items-center gap-1 sm:gap-1.5">
									<span
										ref={(el) => {
											itemRefs.current[idx] = el
										}}
										className="relative h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-2xl"
									/>
									<span
										className={`text-[10px] sm:text-xs text-zinc-300 text-center whitespace-nowrap transition-all duration-300 ${
											targetPos.isHovered ? "opacity-0 -translate-y-1" : "opacity-100 translate-y-0"
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
