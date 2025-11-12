import { Router } from "express";
import authRoutes from "./auth.routes.js";
import custodiaRoutes from "./custodia.routes.js";
import bicicleteroRoutes from "./bicicletero.routes.js";
import encargadoRoutes from "./encargado.routes.js";
import notificacionRoutes from "./notificacion.routes.js";
import informeRoutes from "./informe.routes.js";
import usuarioRoutes from "./usuario.routes.js";

export function routerApi(app) {
  const router = Router();
  app.use("/api", router);

  router.use("/auth", authRoutes);
  router.use("/custodia", custodiaRoutes);
  router.use("/bicicleteros", bicicleteroRoutes);
  router.use("/encargados", encargadoRoutes);
  router.use("/notificaciones", notificacionRoutes);
  router.use("/informes", informeRoutes);
  router.use("/usuarios", usuarioRoutes);
}
