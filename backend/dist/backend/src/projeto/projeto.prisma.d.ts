import { Projeto } from '@core';
import { PrismaProvider } from 'src/db/prisma.provider';
export declare class ProjetoPrisma {
    private readonly prisma;
    constructor(prisma: PrismaProvider);
    obterTodos(): Promise<Projeto[]>;
    obterPorId(id: number): Promise<Projeto | null>;
}
