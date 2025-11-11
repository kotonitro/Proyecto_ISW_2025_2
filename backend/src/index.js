import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/configDB.js";
import { HOST, PORT } from "./config/configEnv.js";
import { createAdmin } from "./config/initialSetup.js"
import router from "./routes/home.routes.js";
import { routerApi } from "./routes/index.routes.js";

const app = express();
app.use(morgan("dev"));

connectDB()
  .then(async () => {

    routerApi(app);
    await createAdmin();

    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://${HOST}:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.log("Error al conectar con la base de datos:", error);
    process.exit(1);
  });