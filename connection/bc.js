const Web3 = require("web3");
const contract = require("@truffle/contract");

const actor_artifact = require("../contracts/actor.json");
const transaction_artifact = require("../contracts/transaction.json");

var Actor = contract(actor_artifact);
var Transaction = contract(transaction_artifact);

const connectBC = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.LOCAL_NODE));
    console.log(`Blockchain connected: ${web3._requestManager.provider.host}`);
    //console.log(web3);
};

// Write there code to interact with contracts, then export them. See examples.
module.exports = {
    backTrackProduct: function (callback) {
        var self = this;

        // Bootstrap the Transaction abstraction for Use.
        Transaction.setProvider(self.web3.currentProvider);

        // TODO : Work on the back track
    },
};

module.exports = connectBC;
