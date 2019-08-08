# The Six Degrees of Kevin Bacon API

## Setup
`npm install`
`nodemon api/index.js`

## Querying the API
* Use your favorite API querying tool (Insomnia, Postman, etc.) or a web browser
* The API endpoint exists at http://localhost:5656/api/v1/degreesOfKevin
* Use the `wikiUrl` query parameter to specify the starting page (this page is used to calculate degrees of separation to Kevin)
* Here's an example of a query: http://localhost:5656/api/v1/degreesOfKevin?wikiUrl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FArkansas

## Deploying
* This repo is set up to be easily deployed via now.sh.
* Install now globally with `npm i -g now`
* Then run the command `now` in the root of this repo.
* Your terminal will guide you through the rest.
