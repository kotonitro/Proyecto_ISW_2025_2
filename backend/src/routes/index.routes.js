import { Router } from "express";
import authRoutes from "./auth.routes.js";
import custodiaRoutes from "./custodia.routes.js";
import bicicleteroRoutes from "./bicicletero.routes.js";
import encargadoRoutes from "./encargado.routes.js";
import notificacionRoutes from "./notificacion.routes.js";

export function routerApi(app) {
  const router = Router();
  app.use("/api", router);

  router.use("/auth", authRoutes);
  router.use("/custodia", custodiaRoutes);
  router.use("/bicicleteros", bicicleteroRoutes);
  router.use("/encargados", encargadoRoutes);
  app.use("/api/notificaciones", notificacionRoutes);
}
