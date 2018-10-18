class TransactionPool {
    constructor() {
        this.transactions = [];
    }

    updateOrAddTransaction(transaction) {
        let transactionWithId = this.transactions.find(t => t.id === transaction.id);

        if(transactionWithId) { // transaction already exists
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
        } else { // new transaction
            this.transactions.push(transaction);
        }
    }

    existingTransaction(address) {
        return this.transactions.find(t => t.input.address === address);
    }
}

module.exports =  TransactionPool;