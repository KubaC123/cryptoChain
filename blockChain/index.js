const Block = require('./block');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock(data) {
        const block = Block.mineBlock(this.chain[this.chain.length - 1], data);
        this.chain.push(block);
        return block;
    }

    isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false; // not valid

        for (let i = 1; i < chain.length; i++) {
            const currentBlock = chain[i];
            const prevBlock = chain[i-1];

            if (currentBlock.lastHash !== prevBlock.hash || 
                /*
                Protects from chain that has matching genesis block and current last hash and prev hash,
                but the underlying data has been manipulated.
                */
                currentBlock.hash !== Block.blockHash(currentBlock)) {
                return false;
            }
        }
        
        return true;
    }

    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            console.log('Received chain is not larger than the current chain.');
            return;
        } else if (!this.isValidChain(newChain)) {
            console.log('Received chain is not valid.');
            return; 
        }
        console.log('Chain replaced.');
        this.chain = newChain;
    }
}

module.exports = Blockchain; 