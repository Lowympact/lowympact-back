const contract = require("@truffle/contract");

const actor_artifact = require("./builds/actor.json");

var Actor = contract(actor_artifact);

// Following are functions which permit to have a JS abstract of the Smart Contract
// and to interact with the ethereum blockchain
// (i.e. create a new instance, deploy it, call its function, etc.)
module.exports = {
    // Create a new actor on the bc
    createActor: async function (id, name, actorType, latitude, longitude, web3) {
        // Bootstrap the Actor abstraction for use
        Actor.setProvider(web3.currentProvider);

        const accounts = await web3.eth.getAccounts();

        newActor = await Actor.new(
            id, // string:
            name, // string:
            actorType, // string:
            latitude, // string:
            longitude, // string:
            {
                from: accounts[5], // specify from account // TODO : Use the wallet address of the actor
            }
        );

        console.log("actor created : " + newActor.address);

        return newActor.address;
    },

    // Create a transaction
    createTransaction: async function (
        productsInput, // Transaction.Product[] memory _productsInput,
        productsOutput, // Transaction.Product[] memory _productsOutput,
        sellerAddress, // string: Seller eth address
        buyerAddress, // string: Buyer eth address,
        idTransaction, // string: idTransaction,
        transport, // Transaction.TransportType: Transport type
        web3 // Web3 Provider
    ) {
        // Bootstrap the Actor abstraction for use
        Actor.setProvider(web3.currentProvider);

        const seller = await Actor.at(sellerAddress);
        const accounts = await web3.eth.getAccounts();

        var ans = await seller.createTransaction(
            productsInput,
            productsOutput,
            buyerAddress,
            idTransaction,
            transport,
            { from: accounts[5] } // TODO : Use the wallet address of the seller
        );

        console.log("transaction created : " + JSON.stringify(ans.logs[0].args._address, null, 4));

        return ans.logs[0].args._address;
    },
};
