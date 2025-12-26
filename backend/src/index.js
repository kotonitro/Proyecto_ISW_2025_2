import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { routerApi } from "./routes/index.routes.js";
import { connectDB } from "./config/configDB.js";
import { HOST, PORT } from "./config/configEnv.js";
import { createAdmin } from "./config/initialSetup.js"
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express(); // Crear la aplicacion de Express
app.use(cors());
app.use(morgan("dev")); // Usar morgan para ver logs en consola
app.use(express.json()) // Middleware de Express para entender los JSON de las peticiones
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
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