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
const swagger = require("./doc/swagger");
const connectDB = require("./connection/db");
const connectBC = require("./connection/bc");
const app = express();

// Set PORT (default:8080)
const PORT = process.env.port || 8080;

// Load env var
dotenv.config({ path: ".env" });

// Connect to Blockchain
connectBC();

// Connect to MongoDB
connectDB();

// Swagger
swagger();

// Import routes files
const userRouter = require("./routes/user");

// CORS
const allowedOrigins = [
  "http://localhost:" + PORT,
  "https://localhost:" + PORT,
  "http://api.lowympact.fr",
  "https://api.lowympact.fr",
];

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
app.use("/api/v1/users", userRouter);

/**
 * @swagger
 * /:
 *   get:
 *     description: Verify API's availability
 *     responses:
 *       200:
 *         description: Lowympact API is Online
 */
app.get("/", function (req, res) {
  res.status(200);
  res.json({ message: "Lowympact API is Online!" });
});

//Custom error handler
app.use(errorHandler);

// ?
/*
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use(async (req, res, next) => {
  if (req.headers["x-access-token"]) {
    const accessToken = req.headers["x-access-token"];
    try {
      const { userId, exp } = await jwt.verify(
        accessToken,
        'O{egv"r&10Dné@fqpmdjvLdQhM:A00;FyszeG)_vHuQ8)Ig0éz,ORbÀ&&FMn bRHAw.D_kj;lkjq`7$T=k-<~ia-@erQP153'
      );

      // Check if token has expired
      if (exp < Date.now().valueOf() / 1000) {
        return res.status(401).json({
          error: "JWT token has expired, please login to obtain a new one",
        });
      }
      try {
        res.locals.loggedInUser = await User.findById(userId);
      } catch (err) {
        res.status(err.code || 401);
        res.json({ message: err.message || "Wrong userId" });
      }
      next();
    } catch (err) {
      res.status(err.code || 401);
      res.json({ message: err.message || "Token expired" });
    }
  } else {
    next();
  }
});

app.use((req, res, next) => {
  console.log(req, res);
  throw new HttpError("Could not find this route.", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});
*/

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.MODE} on port ${PORT}`);
});
