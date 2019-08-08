const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

// const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 5656;
const dburl = 'mongodb://localhost:27017';
const dbName = 'myproject';

async function getLinksOnAPage(pageUrl) {
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

  return finalArray;
}

app.use(cors());

app.get('/api/v1/degreesOfKevin', (req, res) => {
  (async () => {
    const links1 = await getLinksOnAPage('https://en.wikipedia.org/wiki/Kevin_Bacon');

    const linkObj = {};

    await recursive(0, links1.length - 1);

    res.send(linkObj);

    async function recursive(linkNumber, total) {
      if (linkNumber === total) {
        return;
      }
      console.log(linkNumber, linkObj);
      getLinksOnAPage(links1[linkNumber]).then(res => {
        linkObj[links1[linkNumber]] = res;
        recursive(linkNumber + 1, total)
      });
    }

    async function recursion(runNumber, totalRuns, pageUrl) {

      // Get links from page
      // Store links in db
      // kick off new recursion function from each link in array
    }
  })();
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
