"use client"

import React, { useEffect, useRef, useCallback } from "react"

// Conjunto de caracteres binários (0 e 1) para a matriz
const BINARY_CHARS = ["0", "1"]

interface GridCell {
	x: number
	y: number
	char: string
	light: number
	timer: number
	changeRate: number
}

interface MousePoint {
	x: number
	y: number
	age: number
	maxAge: number
}

export default function AsciiCursorBackground() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const containerRef = useRef<HTMLDivElement | null>(null)

	const mouseRef = useRef<{
		x: number | null
		y: number | null
		prevX: number | null
		prevY: number | null
		radius: number
		active: boolean
		lastInteractionTime: number
	}>({
		x: null,
		y: null,
		prevX: null,
		prevY: null,
		radius: 130,
		active: false,
		lastInteractionTime: 0,
	})

	const autoPointRef = useRef<{
		x: number
		y: number
		prevX: number
		prevY: number
	}>({
		x: 0,
		y: 0,
		prevX: 0,
		prevY: 0,
	})

	const mouseHistoryRef = useRef<MousePoint[]>([])
	const gridRef = useRef<GridCell[]>([])
	const animationFrameRef = useRef<number | null>(null)
	const timeRef = useRef<number>(0)

	const dimensionsRef = useRef<{
		width: number
		height: number
		dpr: number
		cols: number
		rows: number
		cellSize: number
	}>({
		width: 0,
		height: 0,
		dpr: 1,
		cols: 0,
		rows: 0,
		cellSize: 20,
	})

	const initGrid = useCallback((width: number, height: number) => {
		const isMobile = width < 640
		const isTablet = width >= 640 && width < 1024

		const cellSize = isMobile ? 18 : isTablet ? 20 : 22
		const cols = Math.ceil(width / cellSize) + 1
		const rows = Math.ceil(height / cellSize) + 1

		dimensionsRef.current.cols = cols
		dimensionsRef.current.rows = rows
		dimensionsRef.current.cellSize = cellSize
		mouseRef.current.radius = isMobile ? 100 : isTablet ? 120 : 145

		// Inicializa a posição do ponto automático no centro
		autoPointRef.current.x = width * 0.5
		autoPointRef.current.y = height * 0.5
		autoPointRef.current.prevX = width * 0.5
		autoPointRef.current.prevY = height * 0.5

		const grid: GridCell[] = []

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				const x = c * cellSize + cellSize / 2
				const y = r * cellSize + cellSize / 2
				const char = BINARY_CHARS[Math.floor(Math.random() * BINARY_CHARS.length)]

				grid.push({
					x,
					y,
					char,
					light: 0,
					timer: Math.floor(Math.random() * 60),
					changeRate: Math.floor(Math.random() * 40) + 30,
				})
			}
		}

		gridRef.current = grid
	}, [])

	const handleResize = useCallback(() => {
		const canvas = canvasRef.current
		const container = containerRef.current
		if (!canvas || !container) return

		const width = window.innerWidth
		const height = window.innerHeight
		const dpr = Math.min(window.devicePixelRatio || 1, 2)

		canvas.width = Math.floor(width * dpr)
		canvas.height = Math.floor(height * dpr)
		canvas.style.width = `${width}px`
		canvas.style.height = `${height}px`

		dimensionsRef.current.width = width
		dimensionsRef.current.height = height
		dimensionsRef.current.dpr = dpr

		initGrid(width, height)
	}, [initGrid])

	// Adiciona segmento de trajetória ao histórico de rastro
	const pushTrailPoints = useCallback((x1: number, y1: number, x2: number, y2: number) => {
		const dist = Math.hypot(x2 - x1, y2 - y1)
		const steps = Math.max(1, Math.min(6, Math.floor(dist / 14)))

		for (let s = 1; s <= steps; s++) {
			const t = s / steps
			mouseHistoryRef.current.push({
				x: x1 + (x2 - x1) * t,
				y: y1 + (y2 - y1) * t,
				age: 0,
				maxAge: 55, // Rastro duradouro
			})
		}

		if (mouseHistoryRef.current.length > 70) {
			mouseHistoryRef.current.splice(0, mouseHistoryRef.current.length - 70)
		}
	}, [])

	// Rastreamento de ponteiro (mouse e toque)
	useEffect(() => {
		const handlePointerMove = (e: MouseEvent | PointerEvent) => {
			if (typeof window !== "undefined") {
				if (window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches) {
					return
				}
				if ("pointerType" in e && e.pointerType === "touch") {
					return
				}
			}

			const currentX = e.clientX
			const currentY = e.clientY

			const prevX = mouseRef.current.prevX ?? currentX
			const prevY = mouseRef.current.prevY ?? currentY

			pushTrailPoints(prevX, prevY, currentX, currentY)

			mouseRef.current.prevX = currentX
			mouseRef.current.prevY = currentY
			mouseRef.current.x = currentX
			mouseRef.current.y = currentY
			mouseRef.current.active = true
			mouseRef.current.lastInteractionTime = Date.now()
		}

		const handlePointerLeave = () => {
			mouseRef.current.x = null
			mouseRef.current.y = null
			mouseRef.current.prevX = null
			mouseRef.current.prevY = null
			mouseRef.current.active = false
		}

		window.addEventListener("pointermove", handlePointerMove, { passive: true })
		window.addEventListener("pointerleave", handlePointerLeave)

		return () => {
			window.removeEventListener("pointermove", handlePointerMove)
			window.removeEventListener("pointerleave", handlePointerLeave)
		}
	}, [pushTrailPoints])

	// Setup resize
	useEffect(() => {
		handleResize()
		window.addEventListener("resize", handleResize)
		return () => {
			window.removeEventListener("resize", handleResize)
		}
	}, [handleResize])

	// Render loop
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

			const { width, height, dpr, cellSize } = dimensionsRef.current
			if (width === 0 || height === 0) {
				animationFrameRef.current = requestAnimationFrame(animate)
				return
			}

			timeRef.current += 0.02
			const time = timeRef.current

			ctx.save()
			ctx.scale(dpr, dpr)

			// Fundo 100% Preto puro
			ctx.fillStyle = "#000000"
			ctx.fillRect(0, 0, width, height)

			const mouse = mouseRef.current
			const grid = gridRef.current
			const radius = mouse.radius
			const mouseHistory = mouseHistoryRef.current

			// Movimento automático contínuo para celular ou quando sem interação
			const isMobile = width < 768
			const timeSinceInteraction = Date.now() - mouse.lastInteractionTime
			const isAutoActive = !mouse.active || (isMobile && timeSinceInteraction > 800)

			let currentAutoX: number | null = null
			let currentAutoY: number | null = null

			if (isAutoActive) {
				const autoT = time * 0.45
				// Curva de Lissajous harmoniosa cruzando a tela suavemente
				const autoX =
					width * 0.5 +
					Math.sin(autoT * 0.9) * (width * 0.4) +
					Math.cos(autoT * 0.4) * (width * 0.1)
				const autoY =
					height * 0.5 +
					Math.cos(autoT * 0.7) * (height * 0.38) +
					Math.sin(autoT * 0.3) * (height * 0.1)

				const prevAutoX = autoPointRef.current.prevX || autoX
				const prevAutoY = autoPointRef.current.prevY || autoY

				pushTrailPoints(prevAutoX, prevAutoY, autoX, autoY)

				autoPointRef.current.prevX = autoX
				autoPointRef.current.prevY = autoY
				autoPointRef.current.x = autoX
				autoPointRef.current.y = autoY

				currentAutoX = autoX
				currentAutoY = autoY
			} else {
				// Atualiza posição inicial do automático para transição suave quando soltar o dedo
				if (mouse.x !== null && mouse.y !== null) {
					autoPointRef.current.prevX = mouse.x
					autoPointRef.current.prevY = mouse.y
				}
			}

			// Atualiza idades dos pontos do rastro
			for (let h = mouseHistory.length - 1; h >= 0; h--) {
				mouseHistory[h].age += 1
				if (mouseHistory[h].age > mouseHistory[h].maxAge) {
					mouseHistory.splice(h, 1)
				}
			}

			// Tipografia nítida e marcante
			const fontSize = Math.max(10, Math.floor(cellSize * 0.58))
			ctx.font = `600 ${fontSize}px "JetBrains Mono", "Fira Code", monospace, ui-monospace`
			ctx.textAlign = "center"
			ctx.textBaseline = "middle"

			// Atualiza a iluminação e desenha APENAS os caracteres onde o rastro está ativo
			for (let i = 0; i < grid.length; i++) {
				const cell = grid[i]
				cell.timer += 1

				// 1. Iluminação do cursor manual do usuário
				if (mouse.x !== null && mouse.y !== null && mouse.active) {
					const dx = mouse.x - cell.x
					const dy = mouse.y - cell.y
					const dist = Math.hypot(dx, dy)

					if (dist < radius) {
						const factor = 1 - dist / radius
						const intensity = Math.pow(factor, 1.2) * 1.15
						cell.light = Math.max(cell.light, Math.min(1.0, intensity))
					}
				}

				// 2. Iluminação da luz automática
				if (currentAutoX !== null && currentAutoY !== null) {
					const adx = currentAutoX - cell.x
					const ady = currentAutoY - cell.y
					const aDist = Math.hypot(adx, ady)

					if (aDist < radius) {
						const aFactor = 1 - aDist / radius
						const aIntensity = Math.pow(aFactor, 1.2) * 1.1
						cell.light = Math.max(cell.light, Math.min(1.0, aIntensity))
					}
				}

				// 3. Iluminação do rastro histórico contínuo
				const historyLen = mouseHistory.length
				if (historyLen > 0) {
					for (let h = 0; h < historyLen; h++) {
						const hp = mouseHistory[h]
						const hdx = hp.x - cell.x
						const hdy = hp.y - cell.y
						const hDist = Math.hypot(hdx, hdy)
						const trailRadius = radius * 0.85

						if (hDist < trailRadius) {
							const hFactor = (1 - hDist / trailRadius) * (1 - hp.age / hp.maxAge)
							if (hFactor > 0) {
								cell.light = Math.max(cell.light, hFactor * 0.95)
							}
						}
					}
				}

				// 4. Decaimento prolongado da luz
				cell.light *= 0.966

				// Se a luz apagou completamente, pula para manter fundo 100% preto sem números visíveis
				if (cell.light < 0.015) {
					continue
				}

				// 5. Troca contínua entre 0 e 1 apenas nas células ativas
				const activeThreshold = cell.light > 0.25 ? 3 : 7
				if (cell.timer >= activeThreshold) {
					cell.timer = 0
					cell.char = BINARY_CHARS[Math.floor(Math.random() * BINARY_CHARS.length)]
				}

				// 6. Renderização exclusiva para o rastro iluminado (sem opacidade residual no fundo)
				if (cell.light > 0.35) {
					const alpha = Math.min(1.0, 0.35 + cell.light * 0.75)
					ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`
				} else if (cell.light > 0.1) {
					const alpha = Math.min(0.85, 0.15 + cell.light * 0.65)
					ctx.fillStyle = `rgba(244, 244, 245, ${alpha.toFixed(3)})`
				} else {
					// Cauda do rastro que se extingue até ficar 100% invisível
					const alpha = Math.min(0.4, cell.light * 3.5)
					ctx.fillStyle = `rgba(212, 212, 216, ${alpha.toFixed(3)})`
				}

				ctx.fillText(cell.char, cell.x, cell.y)
			}

			ctx.restore()
			animationFrameRef.current = requestAnimationFrame(animate)
		}

		const resumeAnimation = () => {
			if (!animationFrameRef.current && isVisible && isRunning) {
				animationFrameRef.current = requestAnimationFrame(animate)
			}
		}

		const handleVisibilityChange = () => {
			if (document.hidden) {
				isVisible = false
			} else {
				isVisible = true
				resumeAnimation()
			}
		}

		document.addEventListener("visibilitychange", handleVisibilityChange)
		animationFrameRef.current = requestAnimationFrame(animate)

		return () => {
			isRunning = false
			document.removeEventListener("visibilitychange", handleVisibilityChange)
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current)
			}
		}
	}, [pushTrailPoints])

	return (
		<div
			ref={containerRef}
			className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0"
			style={{ background: "#000000" }}
			aria-hidden="true"
		>
			<canvas
				ref={canvasRef}
				className="absolute inset-0 w-full h-full block"
			/>
		</div>
	)
}
