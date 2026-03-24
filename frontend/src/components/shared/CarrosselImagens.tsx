import Image from "next/image"
import Link from "next/link"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../ui/carousel"

export interface CarrosselImagensProps {
	imagem: string[]
	repositorio?: string
}

export default function CarrosselImagens(props: CarrosselImagensProps) {
	return (
		<Carousel opts={{ loop: true }} className="w-7/10 md:w-11/12 xl:w-full">
			<CarouselContent>
				{props.imagem.map((imagem) => (
					<CarouselItem
						key={imagem}
						className="relative aspect-video w-full max-w-3xl mx-auto"
					>
						{props.repositorio ? (
							<Link href={props.repositorio} target="_blank">
								<Image
									src={imagem}
									alt="Imagem"
									fill
									className="object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
									sizes="(max-width: 768px) 92vw, 900px"
								/>
							</Link>
						) : (
							<Image
								src={imagem}
								alt="Imagem"
								fill
								className="object-cover rounded-xl"
								sizes="(max-width: 768px) 92vw, 900px"
							/>
						)}
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	)
}
