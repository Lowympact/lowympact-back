const contract = require("@truffle/contract");

const Actor = require("./actor");
const Transaction = require("./transaction");

const Transaction_artifact = require("./builds/transaction.json");
var Transaction_contract = contract(Transaction_artifact);

const Actor_artifact = require("./builds/transaction.json");
var Actor_contract = contract(Transaction_artifact);

const ActorModel = require("../models/actor");
const UserModel = require("../models/actor");
const mongoose = require("mongoose");

resetSimulation = () => {
    mongoose.connection.collections["actors"].drop((err) => {
        console.log("Actor collection dropped.");
    });
};

module.exports = {
    //? Scénario :
    // - Create 3 actors
    // - Create 2 transactions
    // - Given a product id, backtrack all the linked transactions

    main: async function () {
        // At the beginning of the simulation, reset all MongoDB data
        resetSimulation();

        const BAR1 = await Actor.createActor(
            "BAR-85025 ",
            "Barilla Protenza",
            "producer",
            "41.0728191",
            "15.7028457"
        );

        const actorBAR1Model = ActorModel.create({
            actorId: "BAR1",
            actorName: "BAR1",
            actorWalletAddress: BAR1.newWalletAccount,
            actorPasswordHashed: "password",
        });

        const CAR1 = await Actor.createActor(
            "CAR-69100",
            "Carrefour Villeurbanne",
            "maker",
            "45.76478",
            "4.88037"
        );

        const actorCAR1Model = ActorModel.create({
            actorId: "CAR1",
            actorName: "CAR1",
            actorWalletAddress: CAR1.newWalletAccount,
            actorPasswordHashed: "password",
        });

        const CAR2 = await Actor.createActor(
            "CAR-69000",
            "Carrefour Lyon Part Dieu",
            "maker",
            "45.761467",
            "4.857217"
        );

        const actorCAR2Model = ActorModel.create({
            actorId: "CAR2",
            actorName: "CAR2",
            actorWalletAddress: CAR2.newWalletAccount,
            actorPasswordHashed: "password",
        });

        //dechiffer wallet
        const transaction1 = await Actor.createTransaction(
            [
                {
                    productId: "1",
                    addressTransaction: "0x0000000000000000000000000000000000000000",
                },
            ],
            [
                {
                    productId: "2",
                    addressTransaction: "0x0000000000000000000000000000000000000000",
                },
            ],
            CAR1.smartContractActorAddress,
            CAR2.smartContractActorAddress, // string: Buyer eth address
            "transaction1", // string: idTransaction,
            Transaction_contract.enums.TransportType.Train, // Transaction.TransportType: Transport type
            CAR1.newWalletAccount
        );

        const transaction2 = await Actor.createTransaction(
            [
                {
                    productId: "2",
                    addressTransaction: transaction1,
                },
            ],
            [
                {
                    productId: "3",
                    addressTransaction: "0x0000000000000000000000000000000000000000",
                },
            ],
            BAR1.smartContractActorAddress,
            CAR2.smartContractActorAddress, // string: Buyer eth address
            "transaction2", // string: idTransaction,
            Transaction_contract.enums.TransportType.Charette, // Transaction.TransportType: Transport type
            BAR1.newWalletAccount
        );

        //Front export
        console.log("Export mockTransactionFront");
        module.exports.mockTransactionFront = transaction2;

        const productHistory = await Transaction.getProductHistory(transaction2);

        //console.log(productHistory);
    },

    mockTransactionFront: null,
};
