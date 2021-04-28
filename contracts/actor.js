const contract = require("@truffle/contract");

const actor_artifact = require("./builds/actor.json");

var Actor = contract(actor_artifact);

// Following are functions which permit to have a JS abstract of the Smart Contract
// and to interact with the ethereum blockchain
// (i.e. create a new instance, deploy it, call its function, etc.)
module.exports = {
    // Create a new actor on the bc
    createActor: function (id, name, actorType, latitude, longitude, owner, callback) {
        var self = this;

        // Bootstrap the Actor abstraction for use
        Actor.setProvider(self.web3.currentProvider);

        // TODO : Create the instance and return the address so as to store it in MondoDB

        const actorDeployed = await Actor.deployed(id, name, actorType, latitude, longitude, owner);

        return actorDeployed.getAddress.call();
    },

    // Create a transaction
};
