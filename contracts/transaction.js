const contract = require("@truffle/contract");

const Transaction_artifact = require("./builds/transaction.json");

var Transaction = contract(Transaction_artifact);

// Following are functions which permit to have a JS abstract of the Smart Contract
// and to interact with the ethereum blockchain
// (i.e. create a new instance, deploy it, call its function, etc.)
module.exports = {
    getProductHistory: function (bcProductAdress, callback) {
        var self = this;

        // Bootstrap the Transaction abstraction for use
        Transaction.setProvider(self.web3.currentProvider);

        self.web3.eth.getAccounts().then((accounts) => console.log(accounts));

        // TODO : Work on the back track
        // long, lat, Endroit, nom des acteurs
        var result = [];

        //Find the first transaction
        Transaction.at(bcProductAdress).then(function (transaction) {
            console.log(transaction);

            result.push({
                buyer: transaction.getBuyer().getName(),
                buyerType: transaction.getBuyer().getActorType(),
                buyerLat: transaction.getBuyer().getLatitude(),
                buyerLong: transaction.getBuyer().getLongitude(),
                seller: transaction.getSeller().getName(),
                sellerType: transaction.getSeller().getType(),
                sellerLat: transaction.getSeller().getLatitude(),
                sellerLong: transaction.getSeller().getLongitude(),
                transport: transaction.getTransport(),
                date: transport.getDate(),
            });

            console.log(result);
        });

        return JSON.stringify(result);
    },

    // Accept an incoming transaction

    // Finish a pending transaction
};
