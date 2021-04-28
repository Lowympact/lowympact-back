const contract = require("@truffle/contract");

const Actor = require("./actor");
const Transaction = require("./transaction");

const Transaction_artifact = require("./builds/transaction.json");
var Transaction_contract = contract(Transaction_artifact);

const Actor_artifact = require("./builds/transaction.json");
var Actor_contract = contract(Transaction_artifact);

module.exports = {
    // TODO :
    // - Créer 3 acteurs
    // - Créer 2 transactions
    // - Retrouver l'origine du produit à partir de son id donné
    // Cf. https://github.com/arvindkalra/express-box/blob/master/server.js

    main: async function (web3) {
        const CAR1 = await Actor.createActor(
            "CAR-69100",
            "Carrefour Villeurbanne",
            "maker",
            "45.76478",
            "4.88037",
            web3
        );

        const CAR2 = await Actor.createActor(
            "CAR-69000",
            "Carrefour Lyon Part Dieu",
            "maker",
            "45.761467",
            "4.857217",
            web3
        );

        Actor.createTransaction(
            [
                Transaction.Product({
                    productInputId: "noisette1",
                    addressTransaction: "",
                }),
                Transaction.Product({
                    productInputId: "noisette2",
                    addressTransaction: "",
                }),
            ],
            [
                Transaction.Product({
                    productInputId: "nutella1",
                    addressTransaction: "",
                }),
                Transaction.Product({
                    productInputId: "nutella2",
                    addressTransaction: "",
                }),
            ],
            CAR1,
            CAR2, // string: Buyer eth address
            "12345687", // string: idTransaction,
            Transaction_contract.enums.TransportType.Train, // Transaction.TransportType: Type de transport
            web3,
            { from: accounts[5] }
        );
    },
};
