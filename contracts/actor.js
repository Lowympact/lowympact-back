var Actor;

const contract = require("@truffle/contract");
const actor_artifact = require("./builds/actor.json");

Actor = contract(actor_artifact);

// Following are functions which permit to have a JS abstract of the Smart Contract
// and to interact with the ethereum blockchain
// (i.e. create a new instance, deploy it, call its function, etc.)
module.exports = {
    init: function () {
        Actor.setProvider(web3.currentProvider);
    },
    // Create a new actor on the bc
    createActor: async function (id, name, actorType, latitude, longitude, password) {
        //TODO : update these lines when wallet creation will be implemented
        // Create a wallet account for the client (needs to be stored in MongoDB)
        var newWalletAccount = await web3.eth.personal.newAccount(password);
        web3.eth.personal.unlockAccount(newWalletAccount, password, 600);
        // Need some ether from a Ganache created account
        const accounts = await web3.eth.getAccounts();
        const amount = web3.utils.toWei("1", "ether");
        web3.eth.sendTransaction({
            from: accounts[2],
            to: newWalletAccount,
            value: amount,
        });

        newActor = await Actor.new(
            id, // string:
            name, // string:
            actorType, // string:
            latitude, // string:
            longitude, // string:
            {
                from: newWalletAccount, // specify from account
            }
        );

        return { newWalletAccount: newWalletAccount, smartContractActorAddress: newActor.address };
    },

    // Create a transaction
    createTransaction: async function (
        productsInput, // Transaction.Product[] memory _productsInput,
        productsOutput, // Transaction.Product[] memory _productsOutput,
        sellerAddress, // string: Seller eth address
        buyerAddress, // string: Buyer eth address,
        idTransaction, // string: idTransaction,
        transport, // Transaction.TransportType: Transport type
        actorWallet
    ) {
        const seller = await Actor.at(sellerAddress);

        var ans = await seller.createTransaction(
            productsInput,
            productsOutput,
            buyerAddress,
            idTransaction,
            transport,
            { from: actorWallet } // Use the wallet address of the seller
        );

        return ans.logs[0].args._address;
    },
};
