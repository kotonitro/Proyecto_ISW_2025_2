import { EntitySchema } from "typeorm";

export const Encargado = new EntitySchema({
  name: "Encargado",
  tableName: "encargados",
  columns: {
    idEncargado: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    esAdmin: {
      type: "boolean",
      nullable: false,
    },
    rut: {
      type: "varchar",
      length: 8,
      unique: true,
      nullable: false,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    correo: {
      type: "varchar",
      length: 255,
      unique: true,
      nullable: false,
    },
    contrasena: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    telefono: {
      type: "int",
      unique: true,
    },
  },
});
