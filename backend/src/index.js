import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/configDB.js";
import { HOST, PORT } from "./config/configEnv.js";
import { createAdmin } from "./config/initialSetup.js"
import { routerApi } from "./routes/index.routes.js";

const app = express();
app.use(morgan("dev"));

app.use(express.json())
routerApi(app);

connectDB()
  .then(async () => {

    await createAdmin();

    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://${HOST}:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.log("Error al conectar con la base de datos:", error);
    process.exit(1);
  });