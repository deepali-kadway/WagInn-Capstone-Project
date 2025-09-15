import express from "express";
import cors from "cors";
import sequelize from "./config.js";
import hostRegRoute from "./routes/hostRegistration_Routes.js";

const app = express();
app.use(cors());
app.use(express.json());

//use imported routes
app.use("/host", hostRegRoute);

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
  .sync({ force: true })
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
