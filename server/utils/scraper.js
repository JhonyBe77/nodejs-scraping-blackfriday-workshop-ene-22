const puppeteer = require("puppeteer");

const extractProductData = async (url, browser) => {
    try {
        const productData = {};
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3");
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

        // Extracción del nombre del producto
        try {
            productData['name'] = await page.$eval('h1', name => name.textContent.trim());
        } catch {
            productData['name'] = "Nombre no disponible";
        }

        // Extracción del precio del producto
        try {
            productData['price'] = await page.$eval('[data-testid="sale-price"], .ProductPrice_price', price => price.textContent.trim());
        } catch {
            productData['price'] = "Precio no disponible";
        }

        // Extracción de la imagen del producto
        try {
            productData['img'] = await page.$eval('img[class*="zoomImage"]', img => img.src);
        } catch {
            productData['img'] = "Imagen no disponible";
        }

        // Extracción del color del producto
        try {
            productData['color'] = await page.$eval('span[class*="contentPrimary"]', color => color.textContent.trim());
        } catch {
            productData['color'] = "Color no disponible";
        }

        // Extracción de la descripción completa y del resumen
        try {
            await page.waitForSelector('div.ProductDescription_root__OjETM', { timeout: 10000 });
            const fullDescription = await page.$eval('div.ProductDescription_root__OjETM', desc => desc.textContent.trim());
            
            productData['description_full'] = fullDescription;
            productData['description_summary'] = fullDescription.slice(0, 150) + "...";  // Resumimos los primeros 150 caracteres
        } catch {
            productData['description_full'] = "Descripción no disponible";
            productData['description_summary'] = "Descripción no disponible";
        }

        return productData;
    } catch (err) {
        return { error: err.message };
    }
};

const scrap = async (url) => {
    try {
        const scrapedData = [];
        console.log("Opening the browser......");
        const browser = await puppeteer.launch({ headless: false });

        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3");
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
        console.log(`Navigating to ${url}...`);

        // Espera unos segundos para asegurarte de que todo se haya cargado completamente
        await page.waitForTimeout(5000);

        // Capturar URLs de los productos
        const tmpurls = await page.$$eval('a.ProductTile_productTile__hl1o7', links => links.map(a => 'https://www.misterspex.es' + a.getAttribute('href')));
        const urls = tmpurls.filter((link, index) => tmpurls.indexOf(link) === index);

        console.log("URLs capturadas", urls);
        const urls2 = urls.slice(0, 30);

        console.log(`${urls2.length} links encontrados`);

        for (const productLink of urls2) {
            const product = await extractProductData(productLink, browser);
            scrapedData.push(product);
        }

        console.log(scrapedData, "Lo que devuelve mi función scraper", scrapedData.length);

        // Cerrar el navegador
        await browser.close();
        return scrapedData;
    } catch (err) {
        console.log("Error:", err);
    }
};

// Llamada a la función scrap para probar
scrap("https://www.misterspex.es/gafas/").then(data => console.log(data));
