import Encargado from "../entities/encargado.entity.js";
import { AppDataSource } from "./configDB.js";
import bcrypt from "bcrypt";

export async function createAdmin() {
  try {
    const userRepository = AppDataSource.getRepository(Encargado);
    const count = await userRepository.count();
    if (count > 0) return;

    const now = new Date();

    await Promise.all([
      userRepository.save(
        userRepository.create({
          nombre: "Admin",
          esAdmin: true,
          rut: "12345678-9",
          correo: "admin@example.com",
          contrasena: await bcrypt.hash("admin", 10),
          telefono: "12312312",
        }),
      ),
    ]);
    console.log("Admin creado satisfactoriamente");
  } catch (error) {
    console.error("Error al crear el administrador:", error);
  }
}
