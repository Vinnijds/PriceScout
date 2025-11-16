const axios = require('axios');
const cheerio = require('cheerio');
const config = require('./config');
const logger = require('./logger');

// Removemos 'fs' e 'path' (não há mais debug)

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function getSoup(url, userAgent, site) {
  try {
    const response = await axios.get(url, {
      headers: { 
        'User-Agent': userAgent,
        'Accept-Language': 'pt-BR,pt;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Referer': 'https://www.google.com/'
      },
      timeout: 20000 
    });
    // Código de debug removido
    return cheerio.load(response.data);
  } catch (error) {
    logger.warn(`[Scraper] Falha ao acessar ${url}: ${error.message}`);
    // Código de debug de erro removido
    return null;
  }
}

// --- FUNÇÕES DE EXTRAÇÃO ROBUSTAS ---
// Tenta múltiplos seletores até achar o texto
function extractText(item, selectors) {
    for (const selector of selectors) {
        const text = item.find(selector).first().text().trim();
        if (text) return text;
    }
    return null;
}
// Tenta múltiplos seletores até achar o link (href)
function extractLink(item, selectors) {
    for (const selector of selectors) {
        const link = item.find(selector).first().attr('href');
        if (link) return link;
    }
    return null;
}
// Tenta múltiplos seletores até achar a imagem (src ou data-src)
function extractImage(item, selectors) {
    for (const selector of selectors) {
        let image = item.find(selector).first().attr('src');
        if (image) return image;
        image = item.find(selector).first().attr('data-src');
        if (image) return image;
    }
    return null;
}
// Converte "R$ 1.234,56" ou "1.234" para 1234.56
function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleanPrice = priceStr
        .replace("R$", "")
        .replace(/\./g, "") // Remove pontos de milhar
        .replace(",", ".") // Troca vírgula por ponto decimal
        .trim();
    return parseFloat(cleanPrice) || 0;
}


// --- SCRAPER DA AMAZON (v2 Robusto) ---
async function buscaAmazon(termo, userAgent) {
  const results = [];
  const q = termo.replace(/ /g, "+");
  const url = `${config.URLS_BASE.amazon}/s?k=${q}`;
  logger.info(`[Amazon] Buscando: ${termo}...`);
  
  const $ = await getSoup(url, userAgent, 'amazon');
  if (!$) return results;

  const items = $('div[data-component-type="s-search-result"]');
  logger.info(`[Amazon] Seletor principal encontrou ${items.length} itens.`);

  items.slice(0, 5).each((i, el) => {
    const item = $(el);

    const title = extractText(item, [
        'h2 a span' // Seletor principal
    ]);
    
    let link = extractLink(item, [
        'h2 a.a-link-normal' // Seletor principal
    ]);
    if (link && !link.startsWith('http')) {
        link = "https://www.amazon.com.br" + link;
    }
    
    // Lógica de Preço Robusta (v3)
    let price = 0;
    // Tenta o preço principal (ex: "1.200,99")
    const priceText = item.find(".a-price .a-offscreen").first().text();
    price = parsePrice(priceText);
    
    // Fallback (se o preço principal falhar, tenta o "whole" + "fraction")
    if (price === 0) {
        const priceWhole = item.find(".a-price-whole").first().text();
        const priceFraction = item.find(".a-price-fraction").first().text();
        if (priceWhole) {
            price = parsePrice(`${priceWhole},${priceFraction}`);
        }
    }

    const image = extractImage(item, [
        'img.s-image'
    ]);

    if (title && price > 0 && link) {
        logger.info(`[Amazon] Encontrado: ${title.substring(0, 30)}... (R$ ${price})`);
        results.push({ loja: 'Amazon', title, price, link, image });
    } else if (title) {
        logger.warn(`[Amazon] Item pulado (sem preço?): ${title.substring(0, 30)}...`);
    }
  });
  return results;
}

// --- SCRAPER DO MERCADO LIVRE (v2 Robusto) ---
async function buscaMercadoLivre(termo, userAgent) {
  const results = [];
  const q = termo.replace(/ /g, "-");
  const url = `${config.URLS_BASE.mercadolivre}/${q}_Desde_1`;
  logger.info(`[MercadoLivre] Buscando: ${termo}...`);

  const $ = await getSoup(url, userAgent, 'mercadolivre');
  if (!$) return results;

  const items = $("li.ui-search-layout__item, div.ui-search-result__wrapper, div.andes-card");
  logger.info(`[MercadoLivre] Seletor principal encontrou ${items.length} itens.`);

  items.slice(0, 5).each((i, el) => {
    const item = $(el);

    const title = extractText(item, [
        'h2.ui-search-item__title', // Seletor 1
        'a.poly-component__title'   // Seletor 2 (fallback)
    ]);
    
    const link = extractLink(item, [
        'a.ui-search-link',         // Seletor 1
        'a.poly-component__title'   // Seletor 2 (fallback)
    ]);

    // Lógica de Preço Robusta (v3)
    // Pega o símbolo (R$) e a fração (1.234)
    const symbol = item.find(".andes-money-amount__currency-symbol").first().text();
    const priceText = item.find(".andes-money-amount__fraction").first().text();
    
    let price = 0;
    if (priceText) {
        price = parsePrice(priceText);
    }
    
    // Se o preço for R$ (símbolo) mas o valor for 0, tenta outro seletor
    if (price === 0 && symbol === "R$") {
        const altPrice = item.find("span.raw-price, span.price-tag-fraction").first().text();
        price = parsePrice(altPrice);
    }

    const image = extractImage(item, [
        'img.ui-search-result-image__element', // Seletor 1
        'img.poly-component__picture'          // Seletor 2
    ]);

    if (title && price > 0 && link) {
        logger.info(`[MercadoLivre] Encontrado: ${title.substring(0, 30)}... (R$ ${price})`);
        results.push({ loja: 'Mercado Livre', title, price, link, image });
    } else if (title) {
        logger.warn(`[MercadoLivre] Item pulado (sem preço?): ${title.substring(0, 30)}...`);
    }
  });
  return results;
}

module.exports = { buscaAmazon, buscaMercadoLivre, sleep };