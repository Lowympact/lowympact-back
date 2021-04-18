const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
const jwt = require('jsonwebtoken');

const userRoutes = require('./routes/users-routes');
const passwordResetRoutes = require('./routes/passwordReset-routes');

const User = require('./models/User');

const HttpError = require('./models/HttpError');

const app = express();

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
	swaggerDefinition: {
		info: {
			title: "Lowympact API",
			description: "A Long Duration Project in 4th year at INSA Lyon - Lowympact is a food traceability application on top of Ethereum's blockchain",
			contact: {
				name: "HexaOne"
			},
			servers: ["https://thibautgravey.fr:8080"]
		}
	},
	apis: ["server.js", './routes/*.js']
}

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token'
		);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

	next();
});

const allowedOrigins = ['http://localhost:8080', 'http://api.lowympact.fr', 'https://api.lowympact.fr'];
app.use(cors({
	origin: function(origin, callback) {
		// allow requests with no origin
		// (like mobile apps or curl requests)
		if (!origin) return callback(null, true);

		if (allowedOrigins.indexOf(origin) === -1){
			var msg = 'The CORS policy for this site does not ' +
						'allow access from the specified Origin.';
			return callback(new Error(msg), false);
		}

		return callback(null, true);
	}
}));

app.use(async (req, res, next) => {
	if (req.headers["x-access-token"]) {
		const accessToken = req.headers["x-access-token"];
		try {
			const { userId, exp } = await jwt.verify(accessToken,'O{egv"r&10Dné@fqpmdjvLdQhM:A00;FyszeG)_vHuQ8)Ig0éz,ORbÀ&&FMn bRHAw.D_kj;lkjq`7$T=k-<~ia-@erQP153');
			
			// Check if token has expired
			if (exp < Date.now().valueOf() / 1000) {
				return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
			}
			try {
				res.locals.loggedInUser = await User.findById(userId); 
			} catch(err) {
				res.status(err.code || 401);
				res.json({ message: err.message || 'Wrong userId' });
			}
			next();
		}
		catch(err) {
			res.status(err.code || 401);
			res.json({ message: err.message || 'Token expired' });
		}
	} else {
		next();
	}
});

/**
 * @swagger
 * /:
 *   get:
 *     description: Verify API's availability
 *     responses:
 *       200:
 *         description: Lowympact API is Online
 */
app.get('/',function(req, res) {
	res.status(200);
	res.json({ message : 'Lowympact API is Online!'});
});

app.use('/api/users', userRoutes);
app.use('/api/passwordreset', passwordResetRoutes);

app.use((req, res, next) => {
	console.log(req,res);
	throw new HttpError('Could not find this route.', 404);
});


app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
	.connect(
		'mongodb+srv://lowympactBack:'+process.env.MONGODBPWD+'@cluster0.sx8sg.mongodb.net/lowympact?retryWrites=true&w=majority',
		{
			useNewUrlParser: true, 
			useUnifiedTopology: true,
			useCreateIndex: true,
		})
	.then(() => {
		app.listen(8080);
		console.log("Connected to the Lowympact MongoDB");
		console.log("Lowympact API started")
	})
	.catch(err => {
		console.log(err);
	});