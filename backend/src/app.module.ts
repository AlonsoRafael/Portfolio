import { Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler"
import { AppController } from "./app.controller"
import { DbModule } from "./db/db.module"
import { ProjetoModule } from "./projeto/projeto.module"
import { TecnologiaModule } from "./tecnologia/tecnologia.module"

@Module({
	imports: [
		ThrottlerModule.forRoot([
			{
				ttl: 60000,
				limit: 100,
			},
		]),
		DbModule,
		ProjetoModule,
		TecnologiaModule,
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
