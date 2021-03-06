const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain', () => {

    let blockchain, blockchain2;

    beforeEach(() => {
        blockchain = new Blockchain();
        blockchain2 = new Blockchain();
    });

    it('starts with genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain', () => {
        const data = 'foo';
        blockchain.addBlock(data);
        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
    });

    it('validates a valid chain', () => {
        blockchain2.addBlock('foo');
        
        expect(blockchain.isValidChain(blockchain2.chain)).toBe(true);
    });

    it('invalidates a chain with corrupt genesis block', () => {
        blockchain2.chain[0].data = 'Wrong data';

        expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
    });

    it('invalidates a chain with corrupt block', () => {
        blockchain2.addBlock('foo');
        blockchain2.chain[1].data = 'manipulated';
        expect(blockchain.isValidChain(blockchain2.chain)).toBe(false);
    });

    it('replaces the chain with new valid chain', () => {
        blockchain2.addBlock('foo');

        blockchain.replaceChain(blockchain2.chain);
        expect(blockchain.chain).toEqual(blockchain2.chain);
    });

    it('does not replace the chain with chain that is not longer', () => {
        blockchain.addBlock('foo');
        blockchain.replaceChain(blockchain2.chain);
        expect(blockchain.chain).not.toEqual(blockchain2.chain);
    });
    
});