"use server"
import Mensagem from "@/model/Mensagem";

export default async function conversar(chatId: string, mensagem: Mensagem): Promise<string | null> {
    try {
        const webhookUrl = process.env.CHAT_WEBHOOK
        if (!webhookUrl) return null

        const resposta = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", 
            },
            body: JSON.stringify({
                chatId,
                mensagem: mensagem.texto,
            }),
            signal: AbortSignal.timeout(15000), // Timeout de 15 segundos
        })

        if (!resposta.ok) return null

        const msg = await resposta.json()
        return msg?.resposta || null
    } catch {
        return null
    }
}