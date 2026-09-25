"use server"
import Mensagem from "@/model/Mensagem";

// Cache simples em memória para controle de frequência (Rate Limit por chatId)
const historicoEnvios = new Map<string, number[]>();

function checarLimiteFrequencia(chatId: string): boolean {
    const agora = Date.now();
    const timestamps = historicoEnvios.get(chatId) || [];
    
    // Filtra requisições feitas na última janela de 1 minuto (60.000 ms)
    const timestampsRecentes = timestamps.filter((t) => agora - t < 60000);
    
    // Limite: máximo de 10 mensagens por minuto por usuário
    if (timestampsRecentes.length >= 10) {
        return false;
    }

    // Cooldown: mínimo de 1.5s entre mensagens para evitar spam de cliques
    const ultimaMensagem = timestampsRecentes[timestampsRecentes.length - 1];
    if (ultimaMensagem && agora - ultimaMensagem < 1500) {
        return false;
    }

    timestampsRecentes.push(agora);
    historicoEnvios.set(chatId, timestampsRecentes);

    // Limpeza periódica para não reter memória desnecessária
    if (historicoEnvios.size > 1000) {
        for (const [chave, lista] of historicoEnvios.entries()) {
            if (lista.every((t) => agora - t > 120000)) {
                historicoEnvios.delete(chave);
            }
        }
    }

    return true;
}

export default async function conversar(chatId: string, mensagem: Mensagem): Promise<string | null> {
    try {
        const texto = mensagem?.texto?.trim();

        // Validações básicas de segurança e economia de recursos
        if (!texto || texto.length > 800 || !chatId || chatId.length > 100) {
            return null;
        }

        // Bloqueia tentativas de flood/spam automatizado
        if (!checarLimiteFrequencia(chatId)) {
            return "Você está enviando mensagens muito rápido. Aguarde alguns segundos para perguntar novamente!";
        }

        const webhookUrl = process.env.CHAT_WEBHOOK;
        if (!webhookUrl) return null;

        const resposta = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chatId,
                mensagem: texto,
            }),
            signal: AbortSignal.timeout(15000), // Timeout de 15 segundos
        });

        if (!resposta.ok) return null;

        const msg = await resposta.json();
        return msg?.resposta || null;
    } catch {
        return null;
    }
}