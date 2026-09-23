import Mensagem from "@/model/Mensagem";
import useLocalStorage from "./useLocalStorage";
import { Id } from "@core";
import conversar from "@/functions/chat";
import { useState } from "react";

export default function useChat() {
    const [chatId] = useLocalStorage<string>('chatId', Id.gerar())
    const [mensagens, setMensagens] = useLocalStorage<Mensagem[]>('mensagens', [])
    const [pensando, setPensando] = useState(false)

    async function adicionarMensagem(texto: string) {

        try {
        
            setPensando(true)
        
            const novaMensagem: Mensagem = {
            id: Id.gerar(),
            texto,
            autor: "Visitante",
            lado: "direito",
        }
        setMensagens((msgs) => [...msgs, novaMensagem])

        const resposta = await conversar(chatId, novaMensagem)
        const textoResposta =
            resposta ||
            "Ops! O AlonsoBot gastou todos os neurônios (créditos) por hoje. Por favor, tente falar diretamente com o Rafael Alonso no [LinkedIn](https://www.linkedin.com/in/rafael-alonso-5b5099207/) enquanto eu recarrego as energias!"

        const mensagemResposta: Mensagem = {
            id: Id.gerar(),
            texto: textoResposta,
            autor: "AlonsoBot",
            lado: "esquerdo",
        }

        setMensagens((msgs) => [...msgs, mensagemResposta])
    } catch {
        const mensagemErro: Mensagem = {
            id: Id.gerar(),
            texto: "Ops! O AlonsoBot gastou todos os neurônios (créditos) por hoje. Por favor, tente falar diretamente com o Rafael Alonso no [LinkedIn](https://www.linkedin.com/in/rafael-alonso-5b5099207/) enquanto eu recarrego as energias!",
            autor: "AlonsoBot",
            lado: "esquerdo",
        }
        setMensagens((msgs) => [...msgs, mensagemErro])
    } finally {
        setPensando(false)
    }
    }
    
    function limparMensagens() {
        setMensagens([])
    }

    return {
        chatId,
        mensagens,
        adicionarMensagem,
        pensando,
        limparMensagens,
    }
}
