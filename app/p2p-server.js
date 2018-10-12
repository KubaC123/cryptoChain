/* 
 * By creating peer-to-peer, real time connected websocket server
 * we can support multiple contributors to our blockchain app.
 * Every time one block is added to any of the running blockchain instances
 * all the running blockchain apps recive that change and update they chains accordingly.
 */

const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001; // default 5001, or defined in environment - port for listenig for websockets connections
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []; // returns all websocket addreses within one array, or empty array
// $ HTTP_PORT=3002 P2P_PORT=5003 PEERS = ws://localhost:5001,ws://localhost:5002 npm run dev

class P2Pserver {
    
    /**
     * Creates new peer.
     * Each peer has it's own blockchain and array of websocket servers connected to it.
     */
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
    }

    /**
     * Starts up the server.
     */
    listen() { 
        const server = new Websocket.Server({ port: P2P_PORT });
        // connecting the socket that is created as a result of connection event
        server.on('connection', socket => this.connectSocket(socket));

        this.connectToPeers();

        console.log(`Listening for p2p connections on ${P2P_PORT}`);
    }

    connectToPeers() { 
        peers.forEach(peer => {
            // create new socket object
            const socket = new Websocket(peer);
            socket.on('open', () => this.connectSocket(socket));
        });
    }

    /**
     * Pushes new socket to array of sockets.
     */
    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket connected.');

        this.messageHandler(socket);

        this.sendChain(socket);
        }

    /**
     * Allow the sockets to send messages to each other.
     */
    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message);
            
            this.blockchain.replaceChain(data);
        });
    }

    /**
     * Sends socket blockchain.
     */
    sendChain(socket) {
        socket.send(JSON.stringify(this.blockchain.chain));
    }

    /**
     * Sends updated blockchain of current instance to all peers.
     */
    syncChain() { 
        this.sockets.forEach(socket => this.sendChain(socket));
    }
}

module.exports = P2Pserver;