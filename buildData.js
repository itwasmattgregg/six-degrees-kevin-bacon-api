const puppeteer = require('puppeteer');

(async (pageUrl) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  /* Go to the IMDB Movie page and wait for it to load */
  await page.goto(pageUrl, { waitUntil: 'networkidle0' });
  /* Run javascript inside of the page */
  const finalArray = await page.evaluate(() => {
    const results = document.querySelectorAll('.mw-parser-output a[href^="/wiki"]');
    const filteredResults = [];

    results.forEach(node => {
      if (!node) return;
      filteredResults.push(node.href);
    });
    return filteredResults;
  });
  await browser.close();


})
