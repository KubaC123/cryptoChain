const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(timestamp, lastHash, hash, data) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    toString() {
        return `Block
            Timestamp: ${this.timestamp}
            Last Hash: ${this.lastHash.substring(0, 10)}
            Hash     : ${this.hash.substring(0, 10)}
            Data     : ${this.data}`;
    }

    // genesis block
    static genesis() {
        return new this('genesis time', '----', 'cj42-5sx', []);
    }

    static mineBlock(lastBlock, data) {
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        const hash = Block.hash(timestamp, lastHash, data);
        return new this(timestamp, lastHash, hash, data);
    }

    static hash(timestamp, lastHash, data) { 
        return SHA256(`${timestamp}${lastHash}${data}`).toString();
    }

    // gives only the block as input
    static blockHash(block) {
        const { timestamp, lastHash, data } = block; // takes data within this object
        return Block.hash(timestamp, lastHash, data);
    }
}

module.exports = Block;