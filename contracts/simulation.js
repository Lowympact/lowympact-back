const contract = require("@truffle/contract");

const Actor = require("./actor");
const Transaction = require("./transaction");

const Transaction_artifact = require("./builds/transaction.json");
var Transaction_contract = contract(Transaction_artifact);

const Actor_artifact = require("./builds/transaction.json"); //?
var Actor_contract = contract(Transaction_artifact); //?

const ActorModel = require("../models/actor");
const UserModel = require("../models/actor");
const mongoose = require("mongoose");

const { hashPassword } = require("../middleware/hashPassword");

resetSimulation = () => {
    mongoose.connection.collections["actors"].drop((err) => {
        console.log("Actor collection dropped.");
    });
};

module.exports = {
    //? Scénario :
    // - Create 4 actors (glass maker, wallnut maker Italy and France, ferrerro factory, shop)
    // - Create 4 transactions (glass->ferrero, wallnut1->ferrero, wallnut2->ferrero, ferrero->shop)

    main: async function () {
        // At the beginning of the simulation, reset all MongoDB data
        resetSimulation();

        let passwordGlassMaker = hashPassword("password");

        const GlassMaker = await Actor.createActor(
            "GLAS-85025",
            "Murano Soffiatore di Vetro",
            "maker",
            "45.458986",
            "12.352345",
            passwordGlassMaker
        );

        const GlassMakerModel = ActorModel.create({
            name: "Murano Soffiatore di Vetro",
            email: "soffiatore@gmail.com",
            walletAddress: GlassMaker.newWalletAccount,
            password: passwordGlassMaker,
            actorContractAddress: GlassMaker.smartContractActorAddress,
        });

        let passwordWallnutMaker1 = hashPassword("password");

        const WallnutMaker1 = await Actor.createActor(
            "WALL-16872",
            "Nocciola produttore di Madesimo",
            "productor",
            "46.43669",
            "9.358031",
            passwordWallnutMaker1
        );

        const WallnutMaker1Model = ActorModel.create({
            name: "Nocciola produttore di Madesimo",
            email: "nocciola@gmail.com",
            walletAddress: WallnutMaker1.newWalletAccount,
            password: passwordWallnutMaker1,
            actorContractAddress: WallnutMaker1.smartContractActorAddress,
        });

        let passwordWallnutMaker2 = hashPassword("password");

        const WallnutMaker2 = await Actor.createActor(
            "WAL2-37919",
            "Noisettes d'Ardèche",
            "productor",
            "44.407452",
            "4.395401",
            passwordWallnutMaker2
        );

        const WallnutMaker2Model = ActorModel.create({
            name: "Noisettes d'Ardèche",
            email: "ardeche@gmail.com",
            walletAddress: WallnutMaker2.newWalletAccount,
            password: passwordWallnutMaker2,
            actorContractAddress: WallnutMaker2.smartContractActorAddress,
        });

        let passwordFerreroFactory = hashPassword("password");

        const FerreroFactory = await Actor.createActor(
            "FERR-36189",
            "Ferrero Factory Milano",
            "maker",
            "45.4654219",
            "9.1859243",
            passwordFerreroFactory
        );

        const FerreroFactoryModel = ActorModel.create({
            name: "Ferrero Factory Milano",
            email: "factory@gmail.com",
            walletAddress: FerreroFactory.newWalletAccount,
            password: passwordFerreroFactory,
            actorContractAddress: FerreroFactory.smartContractActorAddress,
        });

        let passwordGroceryShop = hashPassword("password");

        const GroceryShop = await Actor.createActor(
            "SHOP-36189",
            "Alla Casa",
            "shop",
            "45.4408474",
            "12.3155151",
            passwordGroceryShop
        );

        const GroceryShopModel = ActorModel.create({
            name: "Alla Casa",
            email: "casa@gmail.com",
            walletAddress: GroceryShop.newWalletAccount,
            password: passwordGroceryShop,
            actorContractAddress: GroceryShop.smartContractActorAddress,
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
                    productId: "idbc", //id PotNutella QRCode
                    addressTransaction: "0x0000000000000000000000000000000000000000",
                },
            ],
            FerreroFactory.smartContractActorAddress,
            GroceryShop.smartContractActorAddress, // string: Buyer eth address
            "Factory->Shop", // string: idTransaction,
            Transaction_contract.enums.TransportType.Boat, // Transaction.TransportType: Transport type
            FerreroFactory.newWalletAccount
        );

        //Front export
        console.log("Export mockTransactionFront");
        module.exports.mockTransactionFront = transaction4;

        const productHistory = await Transaction.getProductHistory(transaction4);

        console.log(productHistory);
    },

    mockTransactionFront: null,
};
