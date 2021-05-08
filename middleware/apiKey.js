//This middleware check if the given API-KEY match the .env one.

//Check API_KEY equality
exports.checkApiKey = (req, res, next) => {
    if (req.headers["api-key"]) {
        let incomingApiKey = req.headers.api - key;
        if (incomingApiKey && process.env.LOWYMPACTAPI_KEY.trim() == incomingApiKey) {
            return next();
        }
    }
    let err = new Error();
    err.message = `This API Key is not authorized to access the route`;
    return next(err);
};
