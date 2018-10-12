const ChainUtil = require('../chain-util');
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {
    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY; // based on previous block or regular given by the config file
    }

    toString() {
        return `Block
            Timestamp   : ${this.timestamp}
            Last Hash   : ${this.lastHash.substring(0, 10)}
            Hash        : ${this.hash.substring(0, 10)}
            Nonce       : ${this.nonce}
            Difficulty  : ${this.difficulty}
            Data        : ${this.data}`;
    }

    // genesis block
    static genesis() {
        return new this('genesis time', '----', 'cj42-5sx', [], 0, DIFFICULTY);
    }

    static mineBlock(lastBlock, data) {
        let hash, timestamp;
        let nonce = 0;
        let { difficulty } = lastBlock;
        const lastHash = lastBlock.hash;
        
        // calculate new hash until it has a number of leading zeros equal to difficulty
        do {
            nonce ++;
            timestamp = Date.now();
            difficulty = Block.balanceDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static hash(timestamp, lastHash, data, nonce, difficulty) { 
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    // gives only the block as input
    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block; // takes data within this object
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    static balanceDifficulty(lastBlock, currentTime)
    {
        let { difficulty } = lastBlock;
        // if the block was mined to fast we increment difficulty by 1, otherwise we decrement it by 1
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }
}

module.exports = Block;