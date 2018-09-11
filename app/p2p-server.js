/* 
 * By creating peer-to-peer, real time connected websocket server
 * we can support multiple contributors to our blockchain app.
 * Every time one block is added to any of the running blockchain instances
 * all the running blockchain apps recive that change and update they chains accordingly.
 */

const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []; // returns all websocket addreses within one array

class P2Pserver {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
    }

    listen() { 
        const server = new Websocket.Server({ port: P2P_PORT });
        server.on('connection', socket => this.connectSocket(socket));
        console.log(`Listening for p2p connections on ${P2P_PORT}`);
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket connected.');
    }
}