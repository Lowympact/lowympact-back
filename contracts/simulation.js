const contract = require("@truffle/contract");

const Actor = require("./actor");
const Transaction = require("./transaction");

const Transaction_artifact = require("./builds/transaction.json");
var Transaction_contract = contract(Transaction_artifact);

const ActorModel = require("../models/actor");
const UserModel = require("../models/user");
const ProductModel = require("../models/product");

const simulationData = require("./simulationData.json");

const mongoose = require("mongoose");

const { hashPassword } = require("../middleware/hashPassword");

resetSimulation = () => {
    mongoose.connection.collections["actors"].drop((err) => {
        console.log("Actor collection dropped.");
    });
    mongoose.connection.collections["products"].drop((err) => {
        console.log("Product collection dropped.");
    });
    mongoose.connection.collections["users"].drop((err) => {
        console.log("Users collection dropped.");
    });
};

module.exports = {
    main: async function () {
        // At the beginning of the simulation, reset all MongoDB data
        resetSimulation();

        var mapIdInfoActor = new Map();
        var mapIdAddressTransaction = new Map();

        // --- ACTORS --- //
        await Promise.all(
            simulationData.actor.map(async (actor) => {
                var passwordHash = hashPassword(actor.password);

                var newActorContract = await Actor.createActor(
                    actor.id,
                    actor.name,
                    actor.type,
                    actor.latitude,
                    actor.longitude,
                    passwordHash
                );

                ActorModel.create({
                    name: actor.name,
                    email: actor.email,
                    walletAddress: newActorContract.newWalletAccount,
                    password: passwordHash,
                    actorContractAddress: newActorContract.smartContractActorAddress,
                });

                mapIdInfoActor.set(actor.id, {
                    walletAddress: newActorContract.newWalletAccount,
                    actorContractAddress: newActorContract.smartContractActorAddress,
                });
            })
        );

        // --- PRODUCTS --- //
        simulationData.products.forEach((product) => {
            ProductModel.create({
                _id: product.id,
                productName: product.name,
            });
        });

        // --- TRANSACTIONS --- //
        for (var i = 0; i < simulationData.transactions.length; i++) {
            var transaction = simulationData.transactions[i];

            var productsIn = [];
            transaction.productsIn.forEach((product) => {
                var addressTransaction =
                    product.idTransaction == ""
                        ? "0x0000000000000000000000000000000000000000"
                        : mapIdAddressTransaction.get(product.idTransaction);

                productsIn.push({
                    productId: product.id,
                    addressTransaction: addressTransaction,
                });
            });

            var productsOut = [];
            transaction.productsOut.forEach((product) => {
                var addressTransaction =
                    product.idTransaction == ""
                        ? "0x0000000000000000000000000000000000000000"
                        : mapIdAddressTransaction.get(product.idTransaction);

                productsOut.push({
                    productId: product.id,
                    addressTransaction: addressTransaction,
                });
            });

            var newTransactionAddress = await Actor.createTransaction(
                productsIn,
                productsOut,
                mapIdInfoActor.get(transaction.sellerId).actorContractAddress,
                mapIdInfoActor.get(transaction.buyerId).actorContractAddress,
                transaction.idTransaction,
                Transaction_contract.enums.TransportType[transaction.transportType],
                mapIdInfoActor.get(transaction.sellerId).walletAddress
            );
            mapIdAddressTransaction.set(transaction.idTransaction, newTransactionAddress);
        }

        // --- USERS --- //
        simulationData.users.forEach((user) => {
            var historyUser = [];
            user.history.forEach((el) => {
                historyUser.push({
                    barcode: el.barcode,
                    bcProductAddress: el.bcProductAddress,
                    insertAt: new Date(
                        (year = el.insertAt.year),
                        (month = el.insertAt.month),
                        (date = el.insertAt.day)
                    ),
                });
            });

            var cartUser = [];
            user.cart.forEach((el) => {
                cartUser.push({
                    barcode: el.barcode,
                    bcProductAddress: el.bcProductAddress,
                    date: new Date(
                        (year = el.date.year),
                        (month = el.date.month),
                        (date = el.date.day)
                    ),
                    quantity: el.quantity,
                    carbonImpact: el.carbonImpact,
                    ecoscore: el.ecoscore,
                });
            });

            UserModel.create({
                username: user.username,
                email: user.email,
                password: hashPassword(user.password),
                createdAt: new Date(
                    (year = user.createdAt.year),
                    (month = user.createdAt.month),
                    (date = user.createdAt.day)
                ),
                history: historyUser,
                cart: cartUser,
            });
        });

        console.log("Simulation initialized !");
    },
};
