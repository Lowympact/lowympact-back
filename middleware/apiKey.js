//This middleware check if the given API-KEY match the .env one.

//Check API_KEY equality
exports.checkApiKey = (req, res, next) => {
    if(req.method == "OPTIONS"){
        return next();
    }
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        let incomingApiKey = req.headers.authorization.split(" ")[1];
        if (incomingApiKey && process.env.LOWYMPACTAPI_KEY.trim() == incomingApiKey) {
            return next();
        }
    }
    let err = new Error();
    err.message = `This API Key is not authorized to access the route`;
    return next(err);
};
