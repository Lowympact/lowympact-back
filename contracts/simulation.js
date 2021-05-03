const contract = require("@truffle/contract");

const Actor = require("./actor");
const Transaction = require("./transaction");

const Transaction_artifact = require("./builds/transaction.json");
var Transaction_contract = contract(Transaction_artifact);

const Actor_artifact = require("./builds/transaction.json"); //?
var Actor_contract = contract(Transaction_artifact); //?

const ActorModel = require("../models/actor");
const UserModel = require("../models/actor");
const ProductModel = require("../models/product");

const mongoose = require("mongoose");

resetSimulation = () => {
    mongoose.connection.collections["actors"].drop((err) => {
        console.log("Actor collection dropped.");
    });
    mongoose.connection.collections["products"].drop((err) => {
        console.log("Product collection dropped.");
    });
};

module.exports = {
    //? Scénario :
    // - Create 4 actors (glass maker, wallnut maker Italy and France, ferrerro factory, shop)
    // - Create 4 transactions (glass->ferrero, wallnut1->ferrero, wallnut2->ferrero, ferrero->shop)

    main: async function () {
        // At the beginning of the simulation, reset all MongoDB data
        resetSimulation();

        const GlassMaker = await Actor.createActor(
            "GLAS-85025",
            "Murano Soffiatore di Vetro",
            "maker",
            "45.458986",
            "12.352345",
            "password"
        );

        const GlassMakerModel = ActorModel.create({
            name: "Murano Soffiatore di Vetro",
            email: "soffiatore@gmail.com",
            walletAddress: GlassMaker.newWalletAccount,
            password: "password",
            actorContractAddress: GlassMaker.smartContractActorAddress,
        });

        const WallnutMaker1 = await Actor.createActor(
            "WALL-16872",
            "Nocciola produttore di Madesimo",
            "productor",
            "46.43669",
            "9.358031",
            "password"
        );

        const WallnutMaker1Model = ActorModel.create({
            name: "Nocciola produttore di Madesimo",
            email: "nocciola@gmail.com",
            walletAddress: WallnutMaker1.newWalletAccount,
            password: "password",
            actorContractAddress: WallnutMaker1.smartContractActorAddress,
        });

        const WallnutMaker2 = await Actor.createActor(
            "WAL2-37919",
            "Noisettes d'Ardèche",
            "productor",
            "44.407452",
            "4.395401",
            "password"
        );

        const WallnutMaker2Model = ActorModel.create({
            name: "Noisettes d'Ardèche",
            email: "ardeche@gmail.com",
            walletAddress: WallnutMaker2.newWalletAccount,
            password: "password",
            actorContractAddress: WallnutMaker2.smartContractActorAddress,
        });

        const FerreroFactory = await Actor.createActor(
            "FERR-36189",
            "Ferrero Factory Milano",
            "maker",
            "45.4654219",
            "9.1859243",
            "password"
        );

        const FerreroFactoryModel = ActorModel.create({
            name: "Ferrero Factory Milano",
            email: "factory@gmail.com",
            walletAddress: FerreroFactory.newWalletAccount,
            password: "password",
            actorContractAddress: FerreroFactory.smartContractActorAddress,
        });

        const GroceryShop = await Actor.createActor(
            "SHOP-36189",
            "Alla Casa",
            "shop",
            "45.4408474",
            "12.3155151",
            "password"
        );

        const GroceryShopModel = ActorModel.create({
            name: "Alla Casa",
            email: "casa@gmail.com",
            walletAddress: GroceryShop.newWalletAccount,
            password: "password",
            actorContractAddress: GroceryShop.smartContractActorAddress,
        });

        const sable = ProductModel.create({
            _id: 1,
            productName: "Sable",
        });

        const potEnVerre = ProductModel.create({
            _id: 2,
            productName: "Pot en verre",
        });

        const noisetteMadesimo = ProductModel.create({
            _id: 3,
            productName: "Noisettes de Madesimo",
        });

        const noisetteMadesimoConcasse = ProductModel.create({
            _id: 4,
            productName: "Noisettes de Madesimo concassées",
        });

        const noisetteArdeche = ProductModel.create({
            _id: 5,
            productName: "Noisettes d'Ardèche",
        });

        const noisetteArdecheConcasse = ProductModel.create({
            _id: 6,
            productName: "Noisettes d'Ardèche concassées",
        });

        const nutella = ProductModel.create({
            _id: 7,
            productName: "Nutella 1kg",
        });

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
            GlassMaker.smartContractActorAddress,
            FerreroFactory.smartContractActorAddress, // string: Buyer eth address
            "Glass->Factory", // string: idTransaction,
            Transaction_contract.enums.TransportType.Train, // Transaction.TransportType: Transport type
            GlassMaker.newWalletAccount
        );

        const transaction2 = await Actor.createTransaction(
            [
                {
                    productId: "3",
                    addressTransaction: "0x0000000000000000000000000000000000000000",
                },
            ],
            [
                {
                    productId: "4",
                    addressTransaction: "0x0000000000000000000000000000000000000000",
                },
            ],
            WallnutMaker1.smartContractActorAddress,
            FerreroFactory.smartContractActorAddress, // string: Buyer eth address
            "Wallnut1->Factory", // string: idTransaction,
            Transaction_contract.enums.TransportType.Charette, // Transaction.TransportType: Transport type
            WallnutMaker1.newWalletAccount
        );

        const transaction3 = await Actor.createTransaction(
            [
                {
                    productId: "5",
                    addressTransaction: "0x0000000000000000000000000000000000000000",
                },
            ],
            [
                {
                    productId: "6",
                    addressTransaction: "0x0000000000000000000000000000000000000000",
                },
            ],
            WallnutMaker2.smartContractActorAddress,
            FerreroFactory.smartContractActorAddress, // string: Buyer eth address
            "Wallnut2->Factory", // string: idTransaction,
            Transaction_contract.enums.TransportType.Truck, // Transaction.TransportType: Transport type
            WallnutMaker2.newWalletAccount
        );

        const transaction4 = await Actor.createTransaction(
            [
                {
                    productId: "2",
                    addressTransaction: transaction1,
                },
                {
                    productId: "4",
                    addressTransaction: transaction2,
                },
                {
                    productId: "6",
                    addressTransaction: transaction3,
                },
            ],
            [
                {
                    productId: "7",
                    addressTransaction: "0x0000000000000000000000000000000000000000",
                },
            ],
            FerreroFactory.smartContractActorAddress,
            GroceryShop.smartContractActorAddress, // string: Buyer eth address
            "Factory->Shop", // string: idTransaction,
            Transaction_contract.enums.TransportType.Boat, // Transaction.TransportType: Transport type
            FerreroFactory.newWalletAccount
        );

        //End of setup
        console.log("Blockchain's simulation done");
    },
};
