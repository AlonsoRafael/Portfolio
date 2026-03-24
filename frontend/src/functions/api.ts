const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function httpGet(url: string) {
    const response = await fetch(normalizarUrl(`${baseURL}/${url}`), {
        cache: "no-store",
        next: { revalidate: 0 },
    });

    if (!response.ok) {
        throw new Error(`Erro ao buscar ${url}: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

function normalizarUrl(url: string) {
    const protocolo = url.split('://')[0]
    const restante = url.split('://')[1]
    return `${protocolo}://${restante.replaceAll(/\/{2,}/g, '/')}`
}