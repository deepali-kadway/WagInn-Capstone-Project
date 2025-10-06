import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

//initialize sequelize constructor
const sequelize = new Sequelize(
  process.env.DATABASE_URL || process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.NODE_ENV === "production" ? "postgres" : "mysql",
    dialectOptions:
      process.env.NODE_ENV === "production"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
    logging: false,
  }
);

export default sequelize;
