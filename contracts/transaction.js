const contract = require("@truffle/contract");

const Transaction_artifact = require("./builds/Transaction.json");

var Transaction = contract(Transaction_artifact);

// Following are functions which permit to have a JS abstract of the Smart Contract
// and to interact with the ethereum blockchain
// (i.e. create a new instance, deploy it, call its function, etc.)
module.exports = {
    getProductHistory: function (callback) {
        var self = this;

        // Bootstrap the Transaction abstraction for use
        Transaction.setProvider(self.web3.currentProvider);

        // TODO : Work on the back track
    },

    // Accept an incoming transaction

    // Finish a pending transaction
};
