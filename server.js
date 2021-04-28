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
const app = express();
const simulation = require("./contracts/simulation");

// Set PORT (default:8080)
const PORT = process.env.port || 8080;

// Load env var
dotenv.config({ path: ".env" });

// Connect to the Blockchain
connectBC();

// Connect to MongoDB
connectDB();

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerInit()));

// Import routes files
// const userRouter = require("./routes/user");
const productRouter = require("./routes/product");

// CORS
const allowedOrigins = [
    "http://localhost:" + PORT,
    "https://localhost:" + PORT,
    "http://api.lowympact.fr",
    "https://api.lowympact.fr",
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
                        "allow access from the specified Origin.";
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
//app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Verify API's availability
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
