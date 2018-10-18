const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');

describe('Wallet', () => {
    let wallet, tp;

    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
    });

    describe('creating a transaction', () => {
        let transaction, sendAmount, recipient;

        beforeEach(() => {
            sendAmount = 50;
            recipient = 'r4nD-4dre55';
            transaction = wallet.createTransaction(recipient, sendAmount, tp);
        });

        describe('and doing the same transaction', () => {
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, tp);
            });

            it('double the `sendAmount` subtracted from the wallet balance', () => {
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - sendAmount * 2);
            });

            // filter executes callback function on each element iof array (outputs) and returns new array (using map) of all elements for which callback function returned true
            it('clones the `sendAmount` output for the recipient', () => {
                expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount)).toEqual([sendAmount, sendAmount]);
            });
        });
    });
});