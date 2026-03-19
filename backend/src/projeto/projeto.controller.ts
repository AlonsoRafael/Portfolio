import { Controller, Get } from '@nestjs/common';
import { Projeto } from '@core';
import { ProjetoPrisma } from './projeto.prisma';
import { Param } from '@nestjs/common';

@Controller('projetos')
export class ProjetoController {

    constructor(private readonly repo: ProjetoPrisma) {}

    @Get()
    async obterTodos(): Promise<Projeto[]> {
        return this.repo.obterTodos();
    }
    
    @Get(':id')
    async obterPorId(@Param('id') id: string): Promise<Projeto | null> {
        return this.repo.obterPorId(Number(id));
    }

}
