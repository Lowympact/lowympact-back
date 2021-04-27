const contract = require("@truffle/contract");

const actor_artifact = require("./builds/actor.json");

var Actor = contract(actor_artifact);

// Following are functions which permit to have a JS abstract of the Smart Contract
// and to interact with the ethereum blockchain
// (i.e. create a new instance, deploy it, call its function, etc.)
module.exports = {
    createTransaction: function (callback) {
        var self = this;

        // Bootstrap the Actor abstraction for use
        Actor.setProvider(self.web3.currentProvider);

        // TODO : Work on the back track
    },
};
