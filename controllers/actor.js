const Actor = require("../models/actor");

/*  GET */

exports.getActors = async (req, res, next) => {
    try {
        const actors = await Actor.find();
        res.status(200).json({
            success: true,
            data: actors,
        });
    } catch (err) {
        next(err);
    }
};

exports.getActor = async (req, res, next) => {
    try {
        const actor = await Actor.findById(req.params.id);
        res.status(200).json({
            success: true,
            data: actor,
        });
    } catch (err) {
        next(err);
    }
};

/*  POST */

exports.createActor = async (req, res, next) => {
    try {
        // Create the new wallet account
        var newWalletAccount = await web3.eth.personal.newAccount(req.body.password);

        // POC : Need some ether from a Ganache created account
        web3.eth.personal.unlockAccount(newWalletAccount, req.body.password, 600);
        const accounts = await web3.eth.getAccounts();
        const amount = web3.utils.toWei("1", "ether");
        web3.eth.sendTransaction({
            from: accounts[0],
            to: newWalletAccount,
            value: amount,
        });

        req.body.walletAddress = newWalletAccount;

        const actor = await Actor.create(req.body);
        res.status(201).json({
            success: true,
            data: actor,
        });
    } catch (err) {
        next(err);
    }
};

/*  PUT */

exports.updateActor = async (req, res, next) => {
    try {
        const actor = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(201).json({
            success: true,
            data: actor,
        });
    } catch (err) {
        next(err);
    }
};

/*  DELETE */

exports.deleteActor = async (req, res, next) => {
    try {
        await Actor.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (err) {
        next(err);
    }
};
