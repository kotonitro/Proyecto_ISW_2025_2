import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/configDB.js";
import { HOST, PORT } from "./config/configEnv.js";

const app = express();
app.use(morgan("dev"));

connectDB()
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://${HOST}:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.log("Error al conectar con la base de datos:", error);
    process.exit(1);
  });