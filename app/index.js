const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockChain');
const P2Pserver = require('./p2p-server');

const HTTP_PORT = process.env.HTTP_PORT || 3001; // user can specify port on the command line

const app = express();
const bc = new Blockchain();
const p2pServer = new P2Pserver(bc);

app.use(bodyParser.json()); // allows to recieve json within post request

app.get('/blocks', (request, response) =>{
    response.json(bc.chain);
});

app.post('/mine', (request, response) => {
    const block = bc.addBlock(request.body.data);
    console.log(`new block added: ${block.toString()}`);

    response.redirect('/blocks');
});

app.listen(HTTP_PORT, () => console.log(`listening on port ${HTTP_PORT}`));
p2pServer.listen();