import { Tecnologia } from '@core';
import { TecnologiaPrisma } from './tecnologia.prisma';
export declare class TecnologiaController {
    private readonly repo;
    constructor(repo: TecnologiaPrisma);
    obterTodas(): Promise<Tecnologia[]>;
    obterDestaques(): Promise<Tecnologia[]>;
}
