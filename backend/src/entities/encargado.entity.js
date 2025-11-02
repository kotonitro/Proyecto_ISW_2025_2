import { EntitySchema } from "typeorm";

export const Encargado = new EntitySchema({
  name: "Encargado",
  tableName: "encargados",
  columns: {
    id_encargado: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    rut: {
      type: "varchar",
      length: 8,
    },
    nombre: {
      type: "varchar",
      length: 255,
    },
    correo: {
      type: "varchar",
      length: 255,
    },
    contraseña: {
      type: "varchar",
      length: 255,
    },
    telefono: {
      type: "int",
      length: 20,
    },
  },
});
