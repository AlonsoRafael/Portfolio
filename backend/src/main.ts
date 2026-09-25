import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import helmet from "helmet"

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	// Security HTTP Headers
	app.use(helmet())

	// CORS Configuration
	app.enableCors({
		origin: [
			"https://alonsotech.vercel.app",
			"http://localhost:3000",
			"http://localhost:3001",
			...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
		],
		methods: ["GET", "HEAD", "OPTIONS"],
		credentials: true,
	})

	await app.listen(process.env.PORT ?? 4000)
}
void bootstrap()
