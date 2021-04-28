const contract = require("@truffle/contract");

const actor_artifact = require("./builds/actor.json");

var Actor = contract(actor_artifact);

// Following are functions which permit to have a JS abstract of the Smart Contract
// and to interact with the ethereum blockchain
// (i.e. create a new instance, deploy it, call its function, etc.)
module.exports = {
    // Create a new actor on the bc
    createActor: async function (id, name, actorType, latitude, longitude, web3) {
        Actor.setProvider(web3.currentProvider);

        const accounts = await web3.eth.getAccounts();

        newActor = await Actor.new(
            id, // string:
            name, // string:
            actorType, // string:
            latitude, // string:
            longitude, // string:
            {
                from: accounts[5], // specify from account
            }
        );

        //a(accounts);

        console.log("actor : " + newActor.address);

        return newActor.address;
    },

    // Create a transaction
    createTransaction: async function (
        productsInput, // Transaction.Product[] memory _productsInput,
        productsOutput, // Transaction.Product[] memory _productsOutput,
        sellerAdress, // string: Seller eth address
        buyerAdress, // string: Actor eth address,
        idTransaction, // string: idTransaction,
        transport, // Transaction.TransportType: Type de transport
        web3 //Web3 Provider
    ) {
        // Bootstrap the Actor abstraction for use
        Actor.setProvider(web3.currentProvider);

        // TODO : Create the instance and return the address so as to store it in MondoDB

        const seller = await Actor.at(sellerAdress);
        const buyer = await Actor.at(buyerAdress);
        const accounts = await web3.eth.getAccounts();

        let ans = await seller.createTransaction(
            productsInput,
            productsOutput,
            buyer,
            idTransaction,
            transport,
            { from: accounts[5] } // TODO: Use the address of the seller
        );

        console.log("Nouvelle transaction crée :");
        console.log(ans);

        return ans;
    },
};

a = function (accounts) {
    return new Promise((resolve) => {
        let a = 0;
        while (1) {
            Actor.new("a", "b", "c", "d", "e", { from: accounts[a] });
            a = (a + 1) % 10;
        }
    });
};
