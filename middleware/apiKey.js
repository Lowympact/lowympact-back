//This middleware check if the given API-KEY match the .env one.

//Check API_KEY equality
exports.checkApiKey = (req, res, next) => {
	if (req.method == "OPTIONS") {
		// Send response to OPTIONS requests
		res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
		res.set("Access-Control-Allow-Headers", "Authorization");
		res.set("Access-Control-Max-Age", "3600");
		res.status(204).send("");
	}
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		let incomingApiKey = req.headers.authorization.split(" ")[1];
		if (
			incomingApiKey &&
			process.env.LOWYMPACTAPI_KEY.trim() == incomingApiKey
		) {
			return next();
		}
	}
	let err = new Error();
	err.message = `This API Key is not authorized to access the route`;
	return next(err);
};
