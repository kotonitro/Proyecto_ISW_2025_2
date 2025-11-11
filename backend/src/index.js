import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { routerApi } from "./routes/index.routes.js";
import { connectDB } from "./config/configDB.js";
import { HOST, PORT } from "./config/configEnv.js";
import { createAdmin } from "./config/initialSetup.js"

const app = express(); // Crear la aplicacion de Express
app.use(morgan("dev")); // Usar morgan para ver logs en consola
app.use(express.json()) // Middleware de Express para entender los JSON de las peticiones
routerApi(app); // Registrar las rutas

// Conectar con la base de datos y luego inicializar el servidor
connectDB()
  .then(async () => {

    await createAdmin(); // Crear Administrador

    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://${HOST}:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.log("Error al conectar con la base de datos:", error);
    process.exit(1);
  });