import express from "express";
import cors from "cors";
import multer from "multer";
import sequelize from "./config.js";
import hostRegRoute from "./routes/hostRegistration_Routes.js";
import hostSignIn from "./routes/hostSignIn_Routes.js";
import userRegRoute from "./routes/userRegistration_Routes.js";
import userSignIn from "./routes/userSignIn_Routes.js"
import "./models/associations.js";

const app = express();

// Configure multer for handling multipart/form-data
const upload = multer();

app.use(
  cors({
    origin: "http://localhost:4200", // Your Angular app URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" })); // Increased limit for safety
app.use(express.urlencoded({ extended: true }));

// Route-specific middleware
// User routes: Handle JSON data
app.use("/user", (req, res, next) => {
  // Ensure user routes expect JSON
  if (
    req.headers["content-type"] &&
    req.headers["content-type"].includes("multipart/form-data")
  ) {
    return res.status(400).json({
      error: "User registration expects JSON data, not form-data",
    });
  }
  next();
});

// Host routes: Handle multipart/form-data
app.use("/host", (req, res, next) => {
  // Host registration will handle its own multer middleware in routes
  next();
});

//use imported routes
app.use("/host", hostRegRoute);
app.use("/host", hostSignIn);
app.use("/user", userRegRoute);
app.use("/user", userSignIn)

//Test DB connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established successfully");
  })
  .catch((error) => {
    console.log("Unable to connect to the database:", error.message);
  });

// Sync models to database and create tables if they don't exist
console.log("About to sync models...");

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database tables created successfully");
  })
  .catch((error) => {
    console.log("Error in creating DB tables: ", error.message);
  });

//debug steps
console.log("Available models:", Object.keys(sequelize.models));
console.log("Connected to database:", sequelize.config.database);

//Listen on Port 3004
app.listen(3004, () => {
  console.log("Server is running on port 3004");
});
