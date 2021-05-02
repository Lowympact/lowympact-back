//Get jwt from model, create cookie and send response
exports.sendJWT = (jwt, data, statusCode, res) => {
	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_EXPIRE * 24 * 3600 * 1000
		),
		httpOnly: true,
	};

	if (process.env.MODE === "production") {
		options.secure = true;
	}

	res.status(statusCode)
		//add cookie
		.cookie("token", jwt, options)
		.json({
			success: true,
			data: data,
		});
};
