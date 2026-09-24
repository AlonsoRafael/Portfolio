import { Projeto } from "@core";
import { httpGet } from "./api";

export async function obterProjetos(): Promise<{ todos: Projeto[]; destaques: Projeto[] }> {
    const projetos: Projeto[] = await httpGet("/projetos", 300);

    // Garante que todas as tecnologias estejam preenchidas com cache de 5 minutos
    const todosCompletos: Projeto[] = await Promise.all(
        (projetos || []).map(async (projeto) => {
            if (projeto.tecnologias && Array.isArray(projeto.tecnologias) && projeto.tecnologias.length > 0) {
                return projeto;
            }
            try {
                const completo = await obterProjeto(String(projeto.id));
                return completo ?? projeto;
            } catch {
                return projeto;
            }
        })
    );

    const destaques = todosCompletos.filter((projeto) => projeto.destaque === true);

    return {
        todos: todosCompletos,
        destaques,
    };
}

export async function obterProjeto(id: string): Promise<Projeto | null> {
    return await httpGet(`/projetos/${id}`, 300);
}