const contract = require("@truffle/contract");
const { json } = require("body-parser");

const transaction_artifact = require("./builds/transaction.json");
const actor_artifact = require("./builds/actor.json");

var Transaction = contract(transaction_artifact);
var Actor = contract(actor_artifact);

// Following are functions which permit to have a JS abstract of the Smart Contract
// and to interact with the ethereum blockchain
// (i.e. create a new instance, deploy it, call its function, etc.)
module.exports = {
    init: function () {
        Transaction.setProvider(web3.currentProvider);
        Actor.setProvider(web3.currentProvider);
    },

    getProductHistory: async function (bcProductAddress) {
        // Backtrack on the product chain
        var result = await getTransactionInformation(bcProductAddress);

        return result;
    },

    // Accept an incoming transaction
    acceptTransaction: async function (addressTransaction, buyer) {
        var transaction = await Transaction.at(addressTransaction);

        transaction.acceptTransaction({ from: buyer.walletAddress });

        return transaction;
    },

    // Finish a pending transaction
    finishTransaction: async function (addressTransaction, buyer) {
        var transaction = await Transaction.at(addressTransaction);

        transaction.finishTransaction({ from: buyer.walletAddress });

        return transaction;
    },
};

getTransactionInformation = async (transactionAddress) => {
    // Get all informations
    var transaction = await Transaction.at(transactionAddress);

    var transactionInformations = await transaction.getTransactionInformations();

    var buyer = await Actor.at(transactionInformations._buyerAddress);
    var seller = await Actor.at(transactionInformations._sellerAddress);

    var buyerInformations = await buyer.getActorInformations();
    var sellerInformations = await seller.getActorInformations();

    // Create result
    var result = [];
    var jsonTransaction = {
        id: transactionInformations._id,
        buyer: {
            id: buyerInformations._id,
            name: buyerInformations._name,
            type: buyerInformations._actorType,
            localisation: {
                longitude: buyerInformations._longitude,
                latitude: buyerInformations._latitude,
            },
        },
        seller: {
            id: sellerInformations._id,
            name: sellerInformations._name,
            type: sellerInformations._actorType,
            localisation: {
                longitude: sellerInformations._longitude,
                latitude: sellerInformations._latitude,
            },
        },
        productsInput: transactionInformations._productsInput,
        productsOutput: transactionInformations._productsOutput,
        transport: getTransportType(transactionInformations._transport),
        date: transactionInformations._date.toNumber(),
        isFinished: transactionInformations._isFinished,
        isAccepted: transactionInformations._isAccepted,
    };

    result.push(jsonTransaction);

    for (let i = 0; i < jsonTransaction.productsInput.length; i++) {
        let address = jsonTransaction.productsInput[i].addressTransaction;
        if (address !== "0x0000000000000000000000000000000000000000") {
            result = result.concat(await getTransactionInformation(address));
        }
    }

    return result;
};

getTransportType = (transportTypeId) => {
    let enumTransportType = Transaction.TransportType;
    for (const value of Object.entries(enumTransportType)) {
        if (value[1] == transportTypeId) {
            return value[0];
        }
    }
    return null;
};
