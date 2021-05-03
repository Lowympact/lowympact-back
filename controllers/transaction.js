const Actor = require("../models/actor");
const ActorContract = require("../contracts/actor");
const TransactionContract = require("../contracts/transaction");

/*  GET */

/*  POST */

exports.createTransaction = async (req, res, next) => {
    try {
        let seller = await Actor.findById(req.jwt.id);
        let buyer = await Actor.findById(req.body.buyerId);

        const transaction = await ActorContract.createTransaction(
            req.body.productsInput,
            req.body.productsOutput,
            seller.actorContractAddress,
            buyer.actorContractAddress,
            "idTransaction",
            req.body.transportTypeId,
            seller.walletAddress
        );

        buyer.transactions.push({
            bcAddress: transaction,
            state: "created",
        });

        buyer.save();

        res.status(201).json({
            success: true,
            data: transaction,
        });
    } catch (err) {
        next(err);
    }
};

/*  PUT */

exports.acceptTransaction = async (req, res, next) => {
    try {
        let buyer = await Actor.findById(req.jwt.id);

        let transactionToAccept = buyer.transactions.find(
            (t) => t.bcAddress == req.params.transactionAddress
        );

        if (transactionToAccept.state == "created") {
            await TransactionContract.acceptTransaction(req.params.transactionAddress, buyer);

            transactionToAccept.state = "accepted";
            buyer.save();

            res.status(200).json({
                success: true,
                data: req.params.transactionAddress,
            });
        } else {
            if (transactionToAccept.state == "accepted") {
                res.status(400).json({
                    success: false,
                    message: "This transaction has already been accepted",
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "This transaction is finished",
                });
            }
        }
    } catch (err) {
        next(err);
    }
};

exports.finishTransaction = async (req, res, next) => {
    try {
        let buyer = await Actor.findById(req.jwt.id);

        let transactionToAccept = buyer.transactions.find(
            (t) => t.bcAddress == req.params.transactionAddress
        );

        if (transactionToAccept.state == "accepted") {
            await TransactionContract.finishTransaction(req.params.transactionAddress, buyer);

            transactionToAccept.state = "finished";
            buyer.save();

            res.status(200).json({
                success: true,
                data: req.params.transactionAddress,
            });
        } else {
            if (transactionToAccept.state == "finished") {
                res.status(400).json({
                    success: false,
                    message: "This transaction is already finished",
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "You must accept the transaction before finish it",
                });
            }
        }
    } catch (err) {
        next(err);
    }
};

/*  DELETE */
