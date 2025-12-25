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
      default: false,
    },

    activo: {
      type: "boolean",
      default: true,
    },
    rut: {
      type: "varchar",
      length: 10,
      unique: true,
      nullable: false,
    },
    nombre: {
      type: "varchar",
      length: 150,
      nullable: false,
    },
    email: {
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
      type: "varchar",
      length: 8,
      unique: true,
      nullable: false,
    },
  },
  relations: {
    registrosAlmacen: {
      type: "one-to-many",
      target: "RegistroAlmacen",
      inverseSide: "encargado",
    },
    informes: {
      type: "one-to-many",
      target: "Informe",
      inverseSide: "encargados",
    },
  },
});
