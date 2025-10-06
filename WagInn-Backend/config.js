import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

//initialize sequelize constructor
let sequelize;

if (process.env.DATABASE_URL) {
  // Production: Use Heroku's DATABASE_URL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  });
} else {
  // Development: Use individual environment variables
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      logging: false,
    }
  );
}

export default sequelize;
