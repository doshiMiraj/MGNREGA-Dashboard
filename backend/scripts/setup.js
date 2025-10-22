const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function setupDatabase() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "postgres", // Connect to default database first
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL");

    // Check if database exists
    const dbCheckQuery = `
      SELECT 1 FROM pg_database WHERE datname = $1
    `;
    const dbExists = await client.query(dbCheckQuery, [process.env.DB_NAME]);

    if (dbExists.rows.length === 0) {
      // Create database
      console.log(`Creating database: ${process.env.DB_NAME}`);
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`Database ${process.env.DB_NAME} created successfully`);
    } else {
      console.log(`Database ${process.env.DB_NAME} already exists`);
    }

    await client.end();

    // Connect to the new database and run migrations
    const appClient = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await appClient.connect();
    console.log(`Connected to ${process.env.DB_NAME}`);

    // Run migration
    const migrationPath = path.join(
      __dirname,
      "../db/migrations/001_create_districts.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    console.log("Running migration: 001_create_districts.sql");
    await appClient.query(migrationSQL);
    console.log("Migration completed successfully");

    await appClient.end();
    console.log("═══════════════════════════════════════════════════");
    console.log("Database setup completed successfully!");
    console.log("═══════════════════════════════════════════════════");
  } catch (error) {
    console.error("Database setup failed:", error.message);
    process.exit(1);
  }
}

setupDatabase();
