"use client"

import React, { useEffect, useRef, useCallback } from "react"

class NodeParticle {
	clusterSide: "left" | "right" | "center"
	x = 0
	y = 0
	vx = 0
	vy = 0
	radius = 0
	baseAlpha = 0
	pulseSpeed = 0
	pulseAngle = 0

	constructor(clusterSide: "left" | "right" | "center", width: number, height: number) {
		this.clusterSide = clusterSide
		this.reset(width, height)
	}

	reset(width: number, height: number) {
		const isMobile = width < 640
		const isTablet = width >= 640 && width < 1024
		const isCompactBar = height < 120
		const spread = isCompactBar ? 0.42 : isMobile ? 0.25 : isTablet ? 0.32 : 0.36

		if (this.clusterSide === "left") {
			this.x = Math.random() * (width * spread)
			this.y = Math.random() * height
		} else if (this.clusterSide === "right") {
			this.x = width - Math.random() * (width * spread)
			this.y = Math.random() * height
		} else {
			// Centro: nós centrais distribuídos
			this.x = isCompactBar
				? Math.random() * width
				: width * 0.36 + Math.random() * (width * 0.28)
			this.y = Math.random() * height
		}

		const speedMultiplier = isCompactBar ? 0.22 : isMobile ? 0.22 : 0.32
		this.vx = (Math.random() - 0.5) * speedMultiplier
		this.vy = (Math.random() - 0.5) * speedMultiplier

		// Raio adaptativo proporcional
		const baseRadius = isCompactBar
			? 0.9 + Math.random() * 1.2
			: isMobile
			? 0.9 + Math.random() * 1.3
			: 1.2 + Math.random() * 2.0
		this.radius = baseRadius
		this.baseAlpha = Math.random() * 0.55 + 0.35
		this.pulseSpeed = Math.random() * 0.03 + 0.01
		this.pulseAngle = Math.random() * Math.PI * 2
	}

	update(
		width: number,
		height: number,
		mouse: { x: number | null; y: number | null; radius: number }
	) {
		this.x += this.vx
		this.y += this.vy

		const isMobile = width < 640
		const isTablet = width >= 640 && width < 1024
		const maxLeft = isMobile ? width * 0.28 : isTablet ? width * 0.36 : width * 0.42
		const minRight = isMobile ? width * 0.72 : isTablet ? width * 0.64 : width * 0.58

		if (this.clusterSide === "left") {
			if (this.x < 8) {
				this.x = 8
				this.vx *= -1
			}
			if (this.x > maxLeft) {
				this.vx *= -1
			}
		} else if (this.clusterSide === "right") {
			if (this.x > width - 8) {
				this.x = width - 8
				this.vx *= -1
			}
			if (this.x < minRight) {
				this.vx *= -1
			}
		}

		if (this.y < 8 || this.y > height - 8) {
			this.vy *= -1
		}

		if (mouse.x !== null && mouse.y !== null) {
			const dx = mouse.x - this.x
			const dy = mouse.y - this.y
			const dist = Math.hypot(dx, dy)

			if (dist < mouse.radius && dist > 1) {
				const force = (mouse.radius - dist) / mouse.radius
				this.x += (dx / dist) * force * 0.45
				this.y += (dy / dist) * force * 0.45
			}
		}

		this.pulseAngle += this.pulseSpeed
	}

	draw(ctx: CanvasRenderingContext2D, height: number) {
		const currentRadius = this.radius + Math.sin(this.pulseAngle) * 0.4

		ctx.save()

		let shadowColor = "#38bdf8"
		let shadowBlur = 20
		let fillColor = `rgba(224, 242, 254, ${Math.min(1, this.baseAlpha + 0.2)})`

		if (this.clusterSide === "left") {
			const isLowerLeft = this.y > height * 0.42
			if (isLowerLeft) {
				// Base esquerda: Verde-esmeralda/teal luminoso
				shadowColor = "#14b8a6"
				shadowBlur = 22
				fillColor = `rgba(167, 243, 208, ${Math.min(1, this.baseAlpha + 0.2)})`
			} else {
				// Topo esquerdo: Azul escuro e super brilhante
				shadowColor = "#38bdf8"
				shadowBlur = 26
				fillColor = `rgba(240, 249, 255, ${Math.min(1, this.baseAlpha + 0.35)})`
			}
		} else if (this.clusterSide === "right") {
			// Direita: Azul mais elétrico, vibrante e brilhante
			shadowColor = "#60a5fa"
			shadowBlur = 26
			fillColor = `rgba(240, 249, 255, ${Math.min(1, this.baseAlpha + 0.35)})`
		}

		ctx.shadowBlur = shadowBlur
		ctx.shadowColor = shadowColor

		ctx.beginPath()
		ctx.arc(this.x, this.y, Math.max(0.6, currentRadius), 0, Math.PI * 2)
		ctx.fillStyle = fillColor
		ctx.fill()

		// Núcleo branco puro nos nós maiores para efeito brilhante reluzente
		if (this.radius > 2.0) {
			ctx.beginPath()
			ctx.arc(this.x, this.y, currentRadius * 0.45, 0, Math.PI * 2)
			ctx.fillStyle = "#ffffff"
			ctx.fill()
		}

		ctx.restore()
	}
}

class DataSpeck {
	x = 0
	y = 0
	vx = 0
	vy = 0
	radius = 0
	alpha = 0

	constructor(width: number, height: number) {
		this.x = Math.random() * width
		this.y = Math.random() * height
		this.vx = (Math.random() - 0.5) * 0.15
		this.vy = (Math.random() - 0.5) * 0.15
		this.radius = Math.random() * 0.9 + 0.3
		this.alpha = Math.random() * 0.25 + 0.05
	}

	update(width: number, height: number) {
		this.x += this.vx
		this.y += this.vy

		if (this.x < 0) this.x = width
		if (this.x > width) this.x = 0
		if (this.y < 0) this.y = height
		if (this.y > height) this.y = 0
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
		ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`
		ctx.fill()
	}
}

export default function NeuralBackground() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const containerRef = useRef<HTMLDivElement | null>(null)

	const mouseRef = useRef<{
		x: number | null
		y: number | null
		radius: number
		active: boolean
	}>({
		x: null,
		y: null,
		radius: 220,
		active: false,
	})

	const particlesRef = useRef<NodeParticle[]>([])
	const dataSpecksRef = useRef<DataSpeck[]>([])
	const animationFrameRef = useRef<number | null>(null)
	const dimensionsRef = useRef<{ width: number; height: number; dpr: number }>({
		width: 0,
		height: 0,
		dpr: 1,
	})

	const initScene = useCallback((width: number, height: number) => {
		const particles: NodeParticle[] = []
		const dataSpecks: DataSpeck[] = []

		const isMobile = width < 640
		const isTablet = width >= 640 && width < 1024
		const isDesktop = width >= 1024 && width < 1536
		const isCompactBar = height < 120 // Top bar / header estreito

		// Quantidade ideal de nós calibrada proporcionalmente à área do container
		let count: number
		let specksCount: number
		let mouseRadius: number

		if (isCompactBar) {
			count = isMobile ? 12 : isTablet ? 22 : 32
			specksCount = isMobile ? 8 : 16
			mouseRadius = 120
		} else if (isMobile) {
			// Telas pequenas (mobile full): 14 a 18 nós super fluidos e leves
			count = Math.min(18, Math.max(14, Math.round(width / 24)))
			specksCount = 8
			mouseRadius = 120
		} else if (isTablet) {
			// Tablets: 35 a 48 nós
			count = Math.min(48, Math.max(35, Math.round(width / 18)))
			specksCount = 20
			mouseRadius = 170
		} else if (isDesktop) {
			// Desktops / Laptops: 60 a 80 nós
			count = Math.min(80, Math.max(60, Math.round(width / 16)))
			specksCount = 35
			mouseRadius = 210
		} else {
			// Telas grandes / Ultrawide: 85 a 110 nós
			count = Math.min(110, Math.max(85, Math.round(width / 15)))
			specksCount = 45
			mouseRadius = 230
		}

		mouseRef.current.radius = mouseRadius

		for (let i = 0; i < count; i++) {
			let side: "left" | "right" | "center" = "left"
			const rand = Math.random()

			if (isMobile) {
				// No mobile, distribui 50% na esquerda e 50% na direita, deixando o centro 100% limpo
				side = rand > 0.5 ? "right" : "left"
			} else {
				if (rand > 0.53) side = "right"
				else if (rand > 0.45) side = "center"
			}

			particles.push(new NodeParticle(side, width, height))
		}

		for (let i = 0; i < specksCount; i++) {
			dataSpecks.push(new DataSpeck(width, height))
		}

		particlesRef.current = particles
		dataSpecksRef.current = dataSpecks
	}, [])

	const handleResize = useCallback(() => {
		const canvas = canvasRef.current
		const container = containerRef.current
		if (!canvas || !container) return

		const rect = container.getBoundingClientRect()
		const width = rect.width
		const height = rect.height
		const dpr = Math.min(window.devicePixelRatio || 1, 2)

		canvas.width = Math.floor(width * dpr)
		canvas.height = Math.floor(height * dpr)
		canvas.style.width = `${width}px`
		canvas.style.height = `${height}px`

		dimensionsRef.current = { width, height, dpr }
		initScene(width, height)
	}, [initScene])

	// Event listeners para rastrear o mouse/toque em toda a seção
	useEffect(() => {
		const canvas = canvasRef.current
		const parent = canvas?.parentElement
		if (!parent) return

		const handlePointerMove = (e: MouseEvent | PointerEvent) => {
			const rect = parent.getBoundingClientRect()
			const inside =
				e.clientX >= rect.left &&
				e.clientX <= rect.right &&
				e.clientY >= rect.top &&
				e.clientY <= rect.bottom

			if (inside) {
				mouseRef.current.x = e.clientX - rect.left
				mouseRef.current.y = e.clientY - rect.top
				mouseRef.current.active = true
			} else {
				mouseRef.current.x = null
				mouseRef.current.y = null
				mouseRef.current.active = false
			}
		}

		const handlePointerLeave = () => {
			mouseRef.current.x = null
			mouseRef.current.y = null
			mouseRef.current.active = false
		}

		const handleTouchMove = (e: TouchEvent) => {
			if (e.touches.length > 0) {
				const rect = parent.getBoundingClientRect()
				const touch = e.touches[0]
				const inside =
					touch.clientX >= rect.left &&
					touch.clientX <= rect.right &&
					touch.clientY >= rect.top &&
					touch.clientY <= rect.bottom

				if (inside) {
					mouseRef.current.x = touch.clientX - rect.left
					mouseRef.current.y = touch.clientY - rect.top
					mouseRef.current.active = true
				}
			}
		}

		const handleTouchEnd = () => {
			mouseRef.current.x = null
			mouseRef.current.y = null
			mouseRef.current.active = false
		}

		window.addEventListener("pointermove", handlePointerMove, { passive: true })
		parent.addEventListener("pointerleave", handlePointerLeave)
		window.addEventListener("touchmove", handleTouchMove, { passive: true })
		window.addEventListener("touchend", handleTouchEnd)
		window.addEventListener("scroll", handlePointerLeave, { passive: true })

		return () => {
			window.removeEventListener("pointermove", handlePointerMove)
			parent.removeEventListener("pointerleave", handlePointerLeave)
			window.removeEventListener("touchmove", handleTouchMove)
			window.removeEventListener("touchend", handleTouchEnd)
			window.removeEventListener("scroll", handlePointerLeave)
		}
	}, [])

	// Setup resize
	useEffect(() => {
		handleResize()
		window.addEventListener("resize", handleResize)

		return () => {
			window.removeEventListener("resize", handleResize)
		}
	}, [handleResize])

	// Loop de animação inteligente com pausa quando fora de tela
	useEffect(() => {
		let isRunning = true
		let isVisible = true

		const animate = () => {
			if (!isRunning) return
			if (!isVisible) {
				animationFrameRef.current = null
				return
			}

			const canvas = canvasRef.current
			if (!canvas) return
			const ctx = canvas.getContext("2d")
			if (!ctx) return

			const { width, height, dpr } = dimensionsRef.current
			if (width === 0 || height === 0) {
				animationFrameRef.current = requestAnimationFrame(animate)
				return
			}

			ctx.save()
			ctx.scale(dpr, dpr)
			ctx.clearRect(0, 0, width, height)

			// -------------------------------------------------------------
			// 1. FUNDO ATMOSFÉRICO & ILUMINAÇÃO DE BAIXO PARA CIMA
			// -------------------------------------------------------------
			const baseGrad = ctx.createLinearGradient(0, 0, width, height)
			baseGrad.addColorStop(0, "#01071a")
			baseGrad.addColorStop(0.5, "#011226")
			baseGrad.addColorStop(1, "#021a36")
			ctx.fillStyle = baseGrad
			ctx.fillRect(0, 0, width, height)

			const bottomUpAmbient = ctx.createLinearGradient(0, height, 0, height * 0.22)
			bottomUpAmbient.addColorStop(0, "rgba(6, 50, 75, 0.28)")
			bottomUpAmbient.addColorStop(0.5, "rgba(2, 25, 45, 0.1)")
			bottomUpAmbient.addColorStop(1, "rgba(1, 7, 26, 0)")
			ctx.fillStyle = bottomUpAmbient
			ctx.fillRect(0, 0, width, height)

			// -------------------------------------------------------------
			// ESQUERDA: Luz Verde/Teal na base
			// -------------------------------------------------------------
			const leftTealBeam = ctx.createRadialGradient(
				width * 0.08,
				height * 1.05,
				30,
				width * 0.15,
				height * 0.7,
				Math.max(width * 0.48, 380)
			)
			leftTealBeam.addColorStop(0, "rgba(18, 140, 160, 0.45)")
			leftTealBeam.addColorStop(0.3, "rgba(12, 100, 120, 0.28)")
			leftTealBeam.addColorStop(0.6, "rgba(6, 60, 80, 0.12)")
			leftTealBeam.addColorStop(0.85, "rgba(2, 25, 45, 0.04)")
			leftTealBeam.addColorStop(1, "rgba(1, 7, 26, 0)")
			ctx.fillStyle = leftTealBeam
			ctx.fillRect(0, 0, width, height)

			const leftCoreGlow = ctx.createRadialGradient(
				0,
				height,
				0,
				width * 0.05,
				height * 0.85,
				Math.max(width * 0.26, 240)
			)
			leftCoreGlow.addColorStop(0, "rgba(35, 180, 165, 0.38)")
			leftCoreGlow.addColorStop(0.4, "rgba(16, 115, 130, 0.18)")
			leftCoreGlow.addColorStop(0.75, "rgba(8, 65, 80, 0.06)")
			leftCoreGlow.addColorStop(1, "rgba(1, 7, 26, 0)")
			ctx.fillStyle = leftCoreGlow
			ctx.fillRect(0, 0, width, height)

			const leftTopBlueGlow = ctx.createRadialGradient(
				width * 0.08,
				0,
				10,
				width * 0.14,
				height * 0.2,
				Math.max(width * 0.35, 260)
			)
			leftTopBlueGlow.addColorStop(0, "rgba(12, 50, 110, 0.25)")
			leftTopBlueGlow.addColorStop(0.6, "rgba(4, 22, 60, 0.08)")
			leftTopBlueGlow.addColorStop(1, "rgba(1, 7, 26, 0)")
			ctx.fillStyle = leftTopBlueGlow
			ctx.fillRect(0, 0, width, height)

			// -------------------------------------------------------------
			// DIREITA: Luz Azul
			// -------------------------------------------------------------
			const rightBlueBeam = ctx.createRadialGradient(
				width * 0.92,
				height * 0.92,
				20,
				width * 0.86,
				height * 0.65,
				Math.max(width * 0.45, 360)
			)
			rightBlueBeam.addColorStop(0, "rgba(14, 60, 130, 0.38)")
			rightBlueBeam.addColorStop(0.4, "rgba(8, 38, 90, 0.2)")
			rightBlueBeam.addColorStop(0.75, "rgba(3, 18, 55, 0.08)")
			rightBlueBeam.addColorStop(1, "rgba(1, 7, 26, 0)")
			ctx.fillStyle = rightBlueBeam
			ctx.fillRect(0, 0, width, height)

			const rightCoreGlow = ctx.createRadialGradient(
				width,
				height,
				0,
				width * 0.95,
				height * 0.85,
				Math.max(width * 0.25, 220)
			)
			rightCoreGlow.addColorStop(0, "rgba(20, 80, 160, 0.32)")
			rightCoreGlow.addColorStop(0.5, "rgba(10, 45, 105, 0.12)")
			rightCoreGlow.addColorStop(1, "rgba(1, 7, 26, 0)")
			ctx.fillStyle = rightCoreGlow
			ctx.fillRect(0, 0, width, height)

			const rightTopBlueGlow = ctx.createRadialGradient(
				width * 0.95,
				0,
				10,
				width * 0.88,
				height * 0.18,
				Math.max(width * 0.32, 240)
			)
			rightTopBlueGlow.addColorStop(0, "rgba(12, 50, 110, 0.25)")
			rightTopBlueGlow.addColorStop(0.6, "rgba(4, 22, 60, 0.08)")
			rightTopBlueGlow.addColorStop(1, "rgba(1, 7, 26, 0)")
			ctx.fillStyle = rightTopBlueGlow
			ctx.fillRect(0, 0, width, height)

			// -------------------------------------------------------------
			// 2. DATA SPECKS
			// -------------------------------------------------------------
			const dataSpecks = dataSpecksRef.current
			for (let i = 0; i < dataSpecks.length; i++) {
				const ds = dataSpecks[i]
				ds.update(width, height)
				ds.draw(ctx)
			}

			// -------------------------------------------------------------
			// 3. NÓS E CONEXÕES SINÁPTICAS
			// -------------------------------------------------------------
			const particles = particlesRef.current
			const mouse = mouseRef.current
			const pLen = particles.length

			const isMobile = width < 640
			const isTablet = width >= 640 && width < 1024
			const isCompactBar = height < 120
			const maxDist = isCompactBar ? Math.min(80, height * 1.25) : isMobile ? 75 : isTablet ? 105 : 135
			const maxClusterCross = isMobile ? width * 0.14 : isTablet ? width * 0.18 : width * 0.22

			for (let i = 0; i < pLen; i++) {
				const p = particles[i]
				p.update(width, height, mouse)
				p.draw(ctx, height)

				for (let j = i + 1; j < pLen; j++) {
					const p2 = particles[j]

					if (p.clusterSide === p2.clusterSide || Math.abs(p.x - p2.x) < maxClusterCross) {
						const dist = Math.hypot(p.x - p2.x, p.y - p2.y)

						if (dist < maxDist) {
							const alpha = (1 - dist / maxDist) * 0.38

							if (p.clusterSide === "left") {
								const avgY = (p.y + p2.y) / 2
								ctx.strokeStyle =
									avgY > height * 0.4
										? `rgba(20, 184, 166, ${alpha})`
										: `rgba(56, 189, 248, ${alpha})`
							} else {
								ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`
							}

							ctx.lineWidth = isMobile ? 0.45 : 0.55
							ctx.beginPath()
							ctx.moveTo(p.x, p.y)
							ctx.lineTo(p2.x, p2.y)
							ctx.stroke()
						}
					}
				}

				if (mouse.x !== null && mouse.y !== null) {
					const mouseDist = Math.hypot(p.x - mouse.x, p.y - mouse.y)
					if (mouseDist < mouse.radius) {
						const mouseAlpha = (1 - mouseDist / mouse.radius) * 0.7
						ctx.strokeStyle = `rgba(125, 211, 252, ${mouseAlpha})`
						ctx.lineWidth = 0.85
						ctx.beginPath()
						ctx.moveTo(p.x, p.y)
						ctx.lineTo(mouse.x, mouse.y)
						ctx.stroke()
					}
				}
			}

			ctx.restore()
			animationFrameRef.current = requestAnimationFrame(animate)
		}

		const resumeAnimation = () => {
			if (!animationFrameRef.current && isVisible && isRunning) {
				animationFrameRef.current = requestAnimationFrame(animate)
			}
		}

		// Pausa quando a aba do navegador fica inativa
		const handleVisibilityChange = () => {
			if (document.hidden) {
				isVisible = false
			} else {
				isVisible = true
				resumeAnimation()
			}
		}

		// Pausa quando o canvas sai da viewport
		let observer: IntersectionObserver | null = null
		if (containerRef.current && typeof IntersectionObserver !== "undefined") {
			observer = new IntersectionObserver(([entry]) => {
				isVisible = entry.isIntersecting
				if (isVisible) {
					resumeAnimation()
				}
			}, { threshold: 0.05 })
			observer.observe(containerRef.current)
		}

		document.addEventListener("visibilitychange", handleVisibilityChange)
		animationFrameRef.current = requestAnimationFrame(animate)

		return () => {
			isRunning = false
			document.removeEventListener("visibilitychange", handleVisibilityChange)
			if (observer) observer.disconnect()
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current)
			}
		}
	}, [])

	return (
		<div
			ref={containerRef}
			className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0"
			style={{ background: "#02112f" }}
			aria-hidden="true"
		>
			<canvas
				ref={canvasRef}
				className="absolute inset-0 w-full h-full block"
			/>
		</div>
	)
}
