// backend/scraper/processing.js
const db = require('../db');

// Regex para extrair informações do título
const REGEX = {
    cpu: /(i[3579]|ryzen\s*[3579])(\s*-\s*\w+)?/i,
    ram: /(\d+)\s*(GB|G)\s*(DE\s*)?(RAM)?/gi,
    ssd: /(\d+)\s*(GB|TB)\s*(SSD|HD|NVME)/i,
    gpu: /(RTX\s*\d+|GTX\s*\d+|Radeon\s*[\w\d]+|Iris\s*Xe)/i
};

function extrairSpecs(titulo) {
    const specs = { cpu: null, ram: null, ssd: null, gpu: null };
    
    // CPU
    const matchCpu = titulo.match(REGEX.cpu);
    if (matchCpu) specs.cpu = matchCpu[0].trim().toUpperCase();

    // RAM
    const matchRam = Array.from(titulo.matchAll(REGEX.ram));
    // Tenta pegar o que tem "RAM" perto, ou o primeiro numero+GB
    const bestRam = matchRam.find(m => m[0].toUpperCase().includes("RAM")) || matchRam[0];
    if (bestRam) {
        const num = bestRam[1] || bestRam[0].match(/\d+/)[0];
        specs.ram = `${num}GB`;
    }

    // SSD/Armazenamento
    const matchSsd = titulo.match(REGEX.ssd);
    if (matchSsd) specs.ssd = matchSsd[0].toUpperCase();

    // GPU
    const matchGpu = titulo.match(REGEX.gpu);
    if (matchGpu) specs.gpu = matchGpu[0].toUpperCase();

    return specs;
}

async function salvarOfertas(produtoId, ofertas) {
    let count = 0;
    for (const oferta of ofertas) {
        const specs = extrairSpecs(oferta.title);

        const query = `
            INSERT INTO Ofertas (
                produto_id, loja, url, titulo_extraido, preco_atual, imagem_url,
                cpu_extraido, ram_extraido, armazenamento_extraido, placa_video_extraida,
                data_ultima_verificacao
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
            ON CONFLICT (url) DO UPDATE SET
                preco_atual = EXCLUDED.preco_atual,
                data_ultima_verificacao = NOW(),
                titulo_extraido = EXCLUDED.titulo_extraido,
                imagem_url = EXCLUDED.imagem_url
            RETURNING id;
        `;

        const values = [
            produtoId, oferta.loja, oferta.link, oferta.title, oferta.price, oferta.image,
            specs.cpu, specs.ram, specs.ssd, specs.gpu
        ];

        try {
            const res = await db.query(query, values);
            // Salva histórico
            if (res.rows[0]) {
                await db.query(
                    "INSERT INTO Historico_Precos (oferta_id, preco) VALUES ($1, $2)",
                    [res.rows[0].id, oferta.price]
                );
                count++;
            }
        } catch (e) {
            console.error(`[DB] Erro ao salvar oferta: ${e.message}`);
        }
    }
    return count;
}

module.exports = { salvarOfertas };