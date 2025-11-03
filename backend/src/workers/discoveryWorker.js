const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const db = require("../../db");
puppeteer.use(StealthPlugin());

/**
 * Busca os notebooks nas lojas configuradas e salva as ofertas no BD.
 */
async function runDiscoveryWorker() {
  console.log("🚀 Iniciando Discovery Worker...");

  // 1️⃣ Obter lista de produtos fixos do banco
  const { rows: produtos } = await db.query("SELECT * FROM produtos");

  // 2️⃣ Lojas suportadas (URLs base)
  const lojas = [
    {
      nome: "Amazon",
      url: (termo) =>
        `https://www.amazon.com.br/s?k=${encodeURIComponent(termo)}`,
      produtoSelectors: [
        'div.s-result-item[data-component-type="s-search-result"]',
        'div.s-card-container',
      ],
      tituloSelectors: [
        "h2 a span",
      ],
      precoSelectors: [
        ".a-price .a-offscreen",
        ".a-price-whole",
      ],
      linkSelectors: [
        "h2 a",
      ],
      imagemSelectors: [
        "img.s-image",
        "img",
      ],
    },
    {
      nome: "Magalu",
      url: (termo) =>
        `https://www.magazineluiza.com.br/busca/${encodeURIComponent(termo)}/`,
      produtoSelectors: [
        '[data-testid="product-card"]',
        'a[data-testid="product-card-container"]',
        'li[class*="product"]',
      ],
      tituloSelectors: [
        '[data-testid="product-title"]',
        "h2",
        "h3",
      ],
      precoSelectors: [
        '[data-testid="price-value"]',
        'span[class*="price"]',
        'p[class*="price"]',
      ],
      linkSelectors: [
        'a[data-testid="product-card-container"]',
        'a[href*="magazineluiza.com.br"]',
        'a[href*="/produto/"]',
      ],
      imagemSelectors: [
        'img[loading]','img',
      ],
    },
  ];

  const headless = process.env.HEADLESS === 'false' ? false : 'new';
  const browser = await puppeteer.launch({
    headless,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
    defaultViewport: { width: 1366, height: 768 },
  });

  async function preparePage(page) {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({ "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8" });
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const resourceType = req.resourceType();
      if (["image", "font", "stylesheet", "media"].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });
  }

  async function autoScroll(page) {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 600;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight - window.innerHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 300);
      });
    });
  }

  for (const produto of produtos) {
    console.log(`🔎 Buscando ofertas para: ${produto.nome_produto}`);

    for (const loja of lojas) {
      const page = await browser.newPage();
      await preparePage(page);
      const urlBusca = loja.url(produto.termo_busca);

      try {
        await page.goto(urlBusca, { waitUntil: "networkidle2", timeout: 45000 });
        await autoScroll(page);

        // Aguarda produtos carregarem com diversos seletores possíveis
        const produtoWaitSelectors = loja.produtoSelectors;
        let foundSelector = null;
        for (const sel of produtoWaitSelectors) {
          try {
            await page.waitForSelector(sel, { timeout: 12000 });
            foundSelector = sel;
            break;
          } catch (_) {}
        }

        const ofertas = await page.evaluate(
          ({ loja, foundSelector }) => {
            function pick(el, selectors) {
              for (const s of selectors) {
                const n = el.querySelector(s);
                if (n && (n.textContent || n.getAttribute)) {
                  if (n.tagName.toLowerCase() === 'img') {
                    return n.src || n.getAttribute('src');
                  }
                  if (n.tagName.toLowerCase() === 'a') {
                    return n.href || n.getAttribute('href');
                  }
                  return n.textContent?.trim();
                }
              }
              return null;
            }

            const nodes = foundSelector ? document.querySelectorAll(foundSelector) : [];
            const lista = [];

            nodes.forEach((el) => {
              const titulo = pick(el, loja.tituloSelectors) || '';
              const preco = pick(el, loja.precoSelectors) || '';
              let link = pick(el, loja.linkSelectors) || '';
              const imagem = pick(el, loja.imagemSelectors) || '';

              if (link && !link.startsWith('http')) {
                try { link = new URL(link, location.origin).href; } catch (_) {}
              }

              // Validação básica — descarta acessórios
              const t = titulo.toLowerCase();
              if (
                titulo && preco &&
                !t.includes("capa") &&
                !t.includes("carregador") &&
                !t.includes("película")
              ) {
                lista.push({ titulo, preco, link, imagem });
              }
            });

            return lista;
          },
          { loja, foundSelector }
        );

        console.log(`💾 ${loja.nome}: ${ofertas.length} ofertas encontradas`);
        // 5️⃣ Salva no banco (somente insert, ignora conflitos por URL)
        for (const oferta of ofertas) {
          await db.query(
            `INSERT INTO ofertas (produto_id, loja, url, titulo_extraido, preco_atual, imagem_url, data_ultima_verificacao)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())
             ON CONFLICT (url) DO NOTHING`,
            [
              produto.id,
              loja.nome,
              oferta.link,
              oferta.titulo,
              parseFloat(oferta.preco.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".")),
              oferta.imagem,
            ]
          );
        }
      } catch (error) {
        console.error(`⚠️ Erro ao buscar ${produto.nome_produto} em ${loja.nome}:`, error.message);
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();
  console.log("✅ Discovery Worker finalizado!");
}

module.exports = { runDiscoveryWorker };
