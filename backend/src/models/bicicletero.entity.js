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
    nombre: {
      type: "varchar",
      length: 100,
      nullable: false,
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
    imagen:{
      type: "varchar",
      lenght: 255,
      nullable: true,
    }
  },
  relations: {
    registrosAlmacen: {
      type: "one-to-many",
      target: "RegistroAlmacen", 
      inverseSide: "bicicletero", 
    }
  }
});
