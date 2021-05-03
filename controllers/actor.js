const Actor = require("../models/actor");
const { sendJWT } = require("../util/sendJWT");
const { hashPassword } = require("../middleware/hashPassword");
const ActorContract = require("../contracts/actor");

/*  GET */

exports.getActor = async (req, res, next) => {
    try {
        if (req.jwt.id === req.params.idActor) {
            const actor = await Actor.findById(req.params.idActor);
            res.status(200).json({
                success: true,
                data: actor,
            });
        } else {
            res.status(403).json({
                success: false,
                message: "Operation not authorized",
            });
        }
    } catch (err) {
        next(err);
    }
};

exports.loginActor = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Validate email & password
        if (!email || !password) {
            let err = new Error();
            err.message = "Please provide an email and a password";
            return next(err);
        }

        const actor = await Actor.findOne({ email }).select("+password");

        var data = { idActor: actor.id };

        if (actor && actor.matchPassword(password)) {
            sendJWT(actor.getSignedJWT(), data, 200, res);
            return next();
        }
        let err = new Error();
        err.message = "Login failed";
        return next(err);
    } catch (err) {
        next(err);
    }
};

/*  POST */

exports.registerActor = async (req, res, next) => {
    try {
        // Create the actor (blockchain)
        // POC : Need some ether from a Ganache created account
        let newActorContract = await ActorContract.createActor(
            req.body.id,
            req.body.name,
            req.body.type,
            req.body.latitude,
            req.body.longitude,
            req.body.password
        );

        req.body.actorContractAddress = newActorContract.smartContractActorAddress;

        req.body.walletAddress = newActorContract.newWalletAccount;

        // create a user a new actor
        req.body.password = hashPassword(req.body.password);
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
        if (req.jwt.id === req.params.idActor) {
            if (req.body.password) {
                req.body.password = hashPassword(req.body.password);
            }
            const actor = await Actor.findByIdAndUpdate(req.params.idActor, req.body, {
                new: true,
                runValidators: true,
            });
            res.status(201).json({
                success: true,
                data: actor,
            });
        } else {
            res.status(403).json({
                success: false,
                message: "Operation not authorized",
            });
        }
    } catch (err) {
        next(err);
    }
};

/*  DELETE */

exports.deleteActor = async (req, res, next) => {
    try {
        if (req.jwt.id === req.params.idActor) {
            await Actor.findByIdAndDelete(req.jwt.id);
            res.status(200).json({
                success: true,
            });
        } else {
            res.status(403).json({
                success: false,
                message: "Operation not authorized",
            });
        }
    } catch (err) {
        next(err);
    }
};
