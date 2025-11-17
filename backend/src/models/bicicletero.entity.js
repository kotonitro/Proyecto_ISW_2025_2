import { EntitySchema } from "typeorm";

export const Bicicletero = new EntitySchema({
  name: "Bicicletero",
  tableName: "bicicleteros",
  columns: {
    idBicicletero: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    ubicacion: {
      type: "varchar",
      length: 255,
      unique: true,
      nullable: false,
    },
    capacidad: {
      type: "int",
      nullable: false,
    },
  },
  relations: {
    registrosAlmacen: {
      type: "one-to-many",
      target: "RegistroAlmacen", 
      inverseSide: "bicicletero", 
    }
  }
});
