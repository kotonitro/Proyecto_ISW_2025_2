"use strict";
import { DataSource } from "typeorm";
import { DATABASE, DB_USERNAME, HOST, PASSWORD } from "./configEnv.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: `${HOST}`,
<<<<<<< HEAD
  port: `${PORT}`,
  username: `${DB_USERNAME}`,
  password: `${PASSWORD}`,
  database: `${DATABASE}`,
  entities: ["src/entity/*.js"],
  synchronize: true,
  logging: false,
});

export async function connectDb() {
  try {
    await AppDataSource.initialize();
    console.log("Conexión exitosa con la base de datos");
=======
  port: 5432,
  username: `${DB_USERNAME}`,
  password: `${PASSWORD}`,
  database: `${DATABASE}`,
  entities: ["entities/**/*.js"],
  synchronize: true, 
  logging: false,
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("=> Conexión exitosa a la base de datos PostgreSQL!");
>>>>>>> dev
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> dev
