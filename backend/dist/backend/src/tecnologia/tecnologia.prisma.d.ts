import { PrismaProvider } from 'src/db/prisma.provider';
import { Tecnologia } from '@core';
export declare class TecnologiaPrisma {
    private readonly prisma;
    constructor(prisma: PrismaProvider);
    obterTodas(): Promise<Tecnologia[]>;
    obterDestaques(): Promise<Tecnologia[]>;
}
