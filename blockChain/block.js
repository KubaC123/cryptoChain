const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY } = require('../config');

class Block {
    constructor(timestamp, lastHash, hash, data, nonce) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
    }

    toString() {
        return `Block
            Timestamp: ${this.timestamp}
            Last Hash: ${this.lastHash.substring(0, 10)}
            Hash     : ${this.hash.substring(0, 10)}
            Nonce    : ${this.nonce}
            Data     : ${this.data}`;
    }

    // genesis block
    static genesis() {
        return new this('genesis time', '----', 'cj42-5sx', [], 0);
    }

    static mineBlock(lastBlock, data) {
        let hash, timestamp;
        const lastHash = lastBlock.hash;
        let nonce = 0;
        
        // calculate new hash until it has a number of leading zeros equal to difficulty
        do {
            nonce ++;
            timestamp = Date.now();
            hash = Block.hash(timestamp, lastHash, data, nonce);
        } while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));

        return new this(timestamp, lastHash, hash, data, nonce);
    }

    static hash(timestamp, lastHash, data, nonce) { 
        return SHA256(`${timestamp}${lastHash}${data}${nonce}`).toString();
    }

    // gives only the block as input
    static blockHash(block) {
        const { timestamp, lastHash, data, nonce } = block; // takes data within this object
        return Block.hash(timestamp, lastHash, data, nonce);
    }
}

module.exports = Block;