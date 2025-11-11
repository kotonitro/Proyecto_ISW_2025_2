import { Router } from "express";
import authRoutes from "./auth.routes.js";
import custodiaRoutes from "./custodia.routes.js";

export function routerApi(app) {
  const router = Router();
  app.use("/api", router);

  router.use("/auth", authRoutes);
  router.use("/custodia", custodiaRoutes);
}
