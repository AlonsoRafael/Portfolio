import { Projeto } from '@core';
import { ProjetoPrisma } from './projeto.prisma';
export declare class ProjetoController {
    private readonly repo;
    constructor(repo: ProjetoPrisma);
    obterTodos(): Promise<Projeto[]>;
    obterPorId(id: string): Promise<Projeto | null>;
}
