const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const errorHandler = require("./middleware/error");
const swaggerInit = require("./doc/swagger");
const swaggerUi = require("swagger-ui-express");
const connectDB = require("./connection/db");
const connectBC = require("./connection/bc");
const simulation = require("./contracts/simulation");
const Actor = require("./contracts/actor");
const Transaction = require("./contracts/transaction");
const app = express();

// Set PORT (default:8080)
const PORT = process.env.port || 8080;

// Load env var
dotenv.config({ path: ".env" });

// Connect to the Blockchain
global.web3 = connectBC();

Actor.init();
Transaction.init();

// Connect to MongoDB
connectDB();

// Launch simulation
simulation.main();

// Import routes files
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const actorRouter = require("./routes/actor");

app.use((req, res, next) => {
	let origin = req.get("origin");
	if (!origin) {
		origin = "*";
	}
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept,api-key, Authorization, x-access-token"
	);
	res.setHeader("Access-Control-Allow-Origin", origin);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PATCH, DELETE, OPTIONS, PUT"
	);
	res.setHeader("Access-Control-Allow-Credentials", true);

	if (req.method == "OPTIONS") {
		res.sendStatus(200);
	}

	next();
});

// CORS
const allowedOrigins = [
	"http://localhost:3000",
	"https://localhost:5000",
	"http://api.lowympact.fr",
	"https://api.lowympact.fr",
	"http://lowympact.fr/",
	"https://lowympact.fr/",
];
if (process.env.MODE !== "development") {
	app.use(
		cors({
			origin: function (origin, callback) {
				// allow requests with no origin
				// (like mobile apps or curl requests)
				if (!origin) return callback(null, true);

				if (allowedOrigins.indexOf(origin) === -1) {
					var msg =
						"The CORS policy for this site does not " +
						"allow access from the specified Origin : " +
						origin;
					return callback(new Error(msg), false);
				}

				return callback(null, true);
			},
		})
	);
}

// Body parser
app.use(express.json()); //to support JSON-encoded bodies

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.MODE === "development") app.use(morgan("dev"));

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Set static folder
// __dirname is the current directory
app.use(express.static(path.join(__dirname, "public")));

// Mount routes
app.use("/api/v1/products", productRouter);
app.use("/api/v1/actors", actorRouter);
app.use("/api/v1/users", userRouter);

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerInit()));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Verify API's availability
 *     tags:
 *       - availability
 *     description: Check if the API is available at the moment
 *     responses:
 *       200:
 *         description: OK
 */
app.get("/", function (req, res) {
	res.status(200);
	res.json({ message: "Lowympact API is Online!" });
});

//Custom error handler
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running in ${process.env.MODE} on port ${PORT}`);
});
