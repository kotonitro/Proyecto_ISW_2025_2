import { EntitySchema } from "typeorm";
import { Bicicletero } from "./bicicletero.entity.js";
import { Bicicleta } from "./bicicleta.entity.js";

export const registroAlmacen = new EntitySchema({
  name: "RegistroAlmacen",
  tableName: "registro_almacen",
  columns: {
    idRegistroAlmacen: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    idBicicletero: {
      type: "int",
    },
    idBicicleta: {
      type: "int",
    },
    fechaEntrada: {
      type: "date",
      nullable: false,
    },
    fechaSalida: {
      type: "date",
      nullable: true,
    },
  },
  relations: {
    bicicletero: {
      type: "many-to-one",
      target: () => Bicicletero,
      joinColumn: {
        name: "idBicicletero",
      },
    },
    bicicleta: {
      type: "many-to-one",
      target: () => Bicicleta,
      joinColumn: {
        name: "idBicicleta",
      },
    },
  },
});
