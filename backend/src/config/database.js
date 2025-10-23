const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Neon requires SSL
        },
      },
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
      }
    );

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully");

    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: false });
      console.log("✅ Database synchronized");
    }
  } catch (error) {
    console.error("❌ Unable to connect to database:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
