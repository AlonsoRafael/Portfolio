"use client"

import React, { useEffect, useRef } from "react"
import Image from "next/image"
import {
	ROBOT_CENTER_FRAME,
	ROBOT_FRAME_HEIGHT,
	ROBOT_FRAME_WIDTH,
	ROBOT_FRAMES,
	ROBOT_TOTAL_FRAMES,
} from "./robotFramesData"

export interface RoboOlhandoProps {
	size?: number
	className?: string
	interactive?: boolean
	alt?: string
}

// Total de frames do ciclo circular completo 360° (0 a 345)
const CIRCLE_FRAMES_LIMIT = 346

// Mapeia o ângulo em graus para o frame mais próximo
function getTargetFrameFromAngle(deg: number): number {
	if (deg >= -180 && deg < -135) {
		const t = (deg + 180) / 45.0
		return Math.round(255 + t * (345 - 255)) % CIRCLE_FRAMES_LIMIT
	} else if (deg >= -135 && deg < -90) {
		const t = (deg + 135) / 45.0
		return Math.round(0 + t * 30)
	} else if (deg >= -90 && deg < -45) {
		const t = (deg + 90) / 45.0
		return Math.round(30 + t * 16)
	} else if (deg >= -45 && deg < 0) {
		const t = (deg + 45) / 45.0
		return Math.round(46 + t * 6)
	} else if (deg >= 0 && deg < 45) {
		const t = deg / 45.0
		return Math.round(52 + t * 48)
	} else if (deg >= 45 && deg < 90) {
		const t = (deg - 45) / 45.0
		return Math.round(100 + t * 43)
	} else if (deg >= 90 && deg < 135) {
		const t = (deg - 90) / 45.0
		return Math.round(143 + t * 32)
	} else {
		const t = (deg - 135) / 45.0
		return Math.round(175 + t * 80)
	}
}

// Singleton cache de imagens dos frames
let loadedImages: (HTMLImageElement | null)[] = []
let isPreloadStarted = false

function initImagesArray() {
	if (loadedImages.length !== ROBOT_TOTAL_FRAMES) {
		loadedImages = new Array(ROBOT_TOTAL_FRAMES).fill(null)
	}
}

// Carrega um frame específico sob demanda
function getOrLoadFrame(index: number): HTMLImageElement | null {
	if (typeof window === "undefined") return null
	initImagesArray()
	const safeIndex = Math.max(0, Math.min(ROBOT_TOTAL_FRAMES - 1, index))
	if (!loadedImages[safeIndex]) {
		const img = new window.Image()
		img.src = ROBOT_FRAMES[safeIndex].src
		loadedImages[safeIndex] = img
	}
	return loadedImages[safeIndex]
}

// Carrega os frames em lotes de forma não bloqueante (após a carga inicial da página)
function scheduleBackgroundPreload() {
	if (typeof window === "undefined" || isPreloadStarted) return
	isPreloadStarted = true
	initImagesArray()

	// Pré-carrega primeiro o frame central
	getOrLoadFrame(ROBOT_CENTER_FRAME)

	const startPreload = () => {
		let currentIdx = 0
		const batchSize = 12

		function loadNextBatch() {
			const end = Math.min(ROBOT_TOTAL_FRAMES, currentIdx + batchSize)
			for (let i = currentIdx; i < end; i++) {
				if (!loadedImages[i]) {
					const img = new window.Image()
					img.src = ROBOT_FRAMES[i].src
					loadedImages[i] = img
				}
			}
			currentIdx = end
			if (currentIdx < ROBOT_TOTAL_FRAMES) {
				if ("requestIdleCallback" in window) {
					;(window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(loadNextBatch)
				} else {
					setTimeout(loadNextBatch, 50)
				}
			}
		}

		if ("requestIdleCallback" in window) {
			;(window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(loadNextBatch)
		} else {
			setTimeout(loadNextBatch, 200)
		}
	}

	if (document.readyState === "complete") {
		setTimeout(startPreload, 300)
	} else {
		window.addEventListener("load", () => setTimeout(startPreload, 300), { once: true })
	}
}

export default function RoboOlhando({
	size,
	className = "",
	interactive = true,
	alt = "Assistente Robô",
}: RoboOlhandoProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	const aspectRatio = ROBOT_FRAME_HEIGHT / ROBOT_FRAME_WIDTH
	const defaultWidth = size || 56
	const defaultHeight = Math.round(defaultWidth * aspectRatio)

	const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({
		x: 0,
		y: 0,
		active: false,
	})

	const currentAngleRef = useRef<number>(0)
	const displayedFrameRef = useRef<number>(ROBOT_CENTER_FRAME)
	const animFrameIdRef = useRef<number | null>(null)
	const lastMoveTimeRef = useRef<number>(0)
	const isLoopRunningRef = useRef<boolean>(false)

	useEffect(() => {
		if (typeof window === "undefined" || !interactive) return

		// Garante que o frame central esteja carregado
		const centerImg = getOrLoadFrame(ROBOT_CENTER_FRAME)
		scheduleBackgroundPreload()

		const drawFrame = (frameIndex: number) => {
			const canvas = canvasRef.current
			const container = containerRef.current
			if (!canvas || !container) return

			const ctx = canvas.getContext("2d")
			if (!ctx) return

			const rect = container.getBoundingClientRect()
			const currentW = rect.width > 0 ? rect.width : defaultWidth
			const currentH = rect.height > 0 ? rect.height : Math.round(currentW * aspectRatio)

			const dpr = window.devicePixelRatio || 1
			const desiredW = Math.round(currentW * dpr)
			const desiredH = Math.round(currentH * dpr)

			if (canvas.width !== desiredW || canvas.height !== desiredH) {
				canvas.width = desiredW
				canvas.height = desiredH
			}

			ctx.clearRect(0, 0, canvas.width, canvas.height)
			ctx.imageSmoothingEnabled = true
			ctx.imageSmoothingQuality = "high"

			const targetImg = getOrLoadFrame(frameIndex) || centerImg
			if (targetImg && targetImg.complete && targetImg.naturalWidth > 0) {
				ctx.drawImage(targetImg, 0, 0, canvas.width, canvas.height)
			} else if (centerImg && centerImg.complete && centerImg.naturalWidth > 0) {
				ctx.drawImage(centerImg, 0, 0, canvas.width, canvas.height)
			}
		}

		// Desenho inicial
		if (centerImg && centerImg.complete) {
			drawFrame(ROBOT_CENTER_FRAME)
		} else if (centerImg) {
			centerImg.onload = () => drawFrame(ROBOT_CENTER_FRAME)
		}

		// Loop de renderização 60fps com auto-sleep quando em repouso
		const renderLoop = (time: number) => {
			const container = containerRef.current
			if (!container) {
				isLoopRunningRef.current = false
				return
			}

			const rect = container.getBoundingClientRect()
			let isIdleOrCenter = true
			let targetFrame = ROBOT_CENTER_FRAME

			if (interactive && mousePosRef.current.active) {
				const centerX = rect.left + rect.width / 2
				const centerY = rect.top + rect.height * 0.35

				const dx = mousePosRef.current.x - centerX
				const dy = mousePosRef.current.y - centerY
				const dist = Math.hypot(dx, dy)
				const timeSinceMove = time - lastMoveTimeRef.current

				if (timeSinceMove <= 3500 && dist >= 24) {
					isIdleOrCenter = false
					const targetDeg = (Math.atan2(dy, dx) * 180.0) / Math.PI
					const angleDiff = ((targetDeg - currentAngleRef.current + 540) % 360) - 180
					currentAngleRef.current = ((currentAngleRef.current + angleDiff * 0.22 + 540) % 360) - 180
					targetFrame = getTargetFrameFromAngle(currentAngleRef.current)
				}
			}

			if (isIdleOrCenter) {
				const frameDiff = ROBOT_CENTER_FRAME - displayedFrameRef.current
				if (Math.abs(frameDiff) < 0.3) {
					displayedFrameRef.current = ROBOT_CENTER_FRAME
					drawFrame(ROBOT_CENTER_FRAME)
					// Pausa o loop em repouso para economizar 100% de CPU
					isLoopRunningRef.current = false
					animFrameIdRef.current = null
					return
				}
				displayedFrameRef.current += Math.max(-6, Math.min(6, frameDiff * 0.18))
			} else {
				let frameDiff = targetFrame - displayedFrameRef.current
				if (targetFrame < CIRCLE_FRAMES_LIMIT && displayedFrameRef.current < CIRCLE_FRAMES_LIMIT) {
					if (frameDiff > CIRCLE_FRAMES_LIMIT / 2) {
						frameDiff -= CIRCLE_FRAMES_LIMIT
					} else if (frameDiff < -CIRCLE_FRAMES_LIMIT / 2) {
						frameDiff += CIRCLE_FRAMES_LIMIT
					}
					const step = Math.max(-8, Math.min(8, frameDiff * 0.35))
					displayedFrameRef.current =
						(displayedFrameRef.current + step + CIRCLE_FRAMES_LIMIT) % CIRCLE_FRAMES_LIMIT
				} else {
					const step = Math.max(-8, Math.min(8, frameDiff * 0.30))
					displayedFrameRef.current = Math.max(
						0,
						Math.min(ROBOT_TOTAL_FRAMES - 1, displayedFrameRef.current + step)
					)
				}
			}

			const frameIndex = Math.max(0, Math.min(ROBOT_TOTAL_FRAMES - 1, Math.round(displayedFrameRef.current)))
			drawFrame(frameIndex)

			animFrameIdRef.current = requestAnimationFrame(renderLoop)
		}

		const wakeUpLoop = () => {
			if (!isLoopRunningRef.current) {
				isLoopRunningRef.current = true
				animFrameIdRef.current = requestAnimationFrame(renderLoop)
			}
		}

		const handleMouseMove = (e: MouseEvent) => {
			mousePosRef.current = { x: e.clientX, y: e.clientY, active: true }
			lastMoveTimeRef.current = performance.now()
			wakeUpLoop()
		}

		const handleTouchMove = (e: TouchEvent) => {
			if (e.touches.length > 0) {
				mousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: true }
				lastMoveTimeRef.current = performance.now()
				wakeUpLoop()
			}
		}

		window.addEventListener("mousemove", handleMouseMove, { passive: true })
		window.addEventListener("touchmove", handleTouchMove, { passive: true })

		// Inicia um ciclo curto para estabilizar no centro
		wakeUpLoop()

		return () => {
			if (animFrameIdRef.current) {
				cancelAnimationFrame(animFrameIdRef.current)
			}
			window.removeEventListener("mousemove", handleMouseMove)
			window.removeEventListener("touchmove", handleTouchMove)
		}
	}, [interactive, defaultWidth, defaultHeight, aspectRatio])

	if (!interactive) {
		return (
			<div
				ref={containerRef}
				className={`inline-flex items-center justify-center select-none pointer-events-none relative ${className}`}
				style={size ? { width: size, height: Math.round(size * aspectRatio) } : undefined}
				aria-label={alt}
			>
				<Image
					src="/robot/frames/frame_315.webp"
					alt={alt}
					width={size || 56}
					height={Math.round((size || 56) * aspectRatio)}
					className="w-full h-full object-contain block"
					priority={false}
				/>
			</div>
		)
	}

	return (
		<div
			ref={containerRef}
			className={`inline-flex items-center justify-center select-none pointer-events-none relative ${className}`}
			style={size ? { width: size, height: Math.round(size * aspectRatio) } : undefined}
			aria-label={alt}
		>
			<canvas
				ref={canvasRef}
				style={{
					width: "100%",
					height: "100%",
					display: "block",
				}}
				className="object-contain"
			/>
		</div>
	)
}
