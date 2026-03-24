import { Projeto } from "@core";
import { httpGet } from "./api";

export async function obterProjetos() {
    const projetos: Projeto[] = await httpGet("/projetos");

    const destaques = projetos.filter((projeto) => projeto.destaque === true);

  return {
    todos: projetos,
    destaques,
  };
}

export async function obterProjeto(id: string): Promise<Projeto | null> {
    return await httpGet(`/projetos/${id}`);
}