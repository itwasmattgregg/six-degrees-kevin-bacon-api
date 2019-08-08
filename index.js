const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const axios = require('axios');
const _ = require('lodash');

const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 5656;
const dburl = 'mongodb://localhost:27017';
const dbName = 'kevin-bacon';

app.use(cors());

app.get('/api/v1/degreesOfKevin', (req, res) => {
  (async () => {
    function getAllPagesLinkingTo(pageid, array = [], continueId) {
      let url = `http://en.wikipedia.org/w/api.php?format=json&action=query&pageids=${pageid}&prop=linkshere&lhlimit=500`;
      if (continueId) {
        url = `http://en.wikipedia.org/w/api.php?format=json&action=query&pageids=${pageid}&prop=linkshere&lhlimit=500&lhcontinue=${continueId}`;
      }

      return axios.get(url)
        .then((response) => {
          const pages = [
            ...array,
            ...response.data.query.pages[pageid].linkshere
          ];

          if (response.data.continue) {
            return getAllPagesLinkingTo(pageid, pages, response.data.continue.lhcontinue);
          } else {
            return pages;
          }
        })
        .catch((err) => {
          return err;
        });
    };

    // This isn't recursive right now. Will break on big pages
    function linksOnPage(title, array = [], continueId) {
      let url = `http://en.wikipedia.org/w/api.php?format=json&action=query&titles=${title}&prop=links&pllimit=500`;
      if (continueId) {
        url = `http://en.wikipedia.org/w/api.php?format=json&action=query&titles=${title}&prop=links&pllimit=500&plcontinue=${continueId}`;
      }
      return axios.get(url)
        .then((response) => {
          const [first] = Object.keys(response.data.query.pages)
          const pages = [
            ...array,
            ...response.data.query.pages[first].links
          ];
          if (response.data.continue) {
            return linksOnPage(title, pages, response.data.continue.plcontinue);
          } else {
            return pages;
          }
        })
        .catch((err) => {
          return err;
        });
    }

    let numDegrees = 0;

    const searchTitle = req.query.wikiUrl.substring(req.query.wikiUrl.lastIndexOf('/') + 1);

    const pagesToKevin = await getAllPagesLinkingTo("16827");

    if (_.some(pagesToKevin, obj => {
      return obj.title === decodeURI(searchTitle).replace('_', ' ');
    })) {
      numDegrees = 1;
      res.send(`${numDegrees} degree${numDegrees > 1 ? 's': ''} of separation`);
      // Exit function. Response has been sent;
      return;
    }

    const linksOnRequestedPage = await linksOnPage(searchTitle);

    if (_.intersectionBy(linksOnRequestedPage, pagesToKevin, 'title')) {
      res.send(`2 degrees of separation`);
      return;
    }
    res.send(`Can't find it`);
  })();
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
