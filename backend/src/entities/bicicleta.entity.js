import { EntitySchema } from "typeorm";
import { Usuario } from "./usuario.entity.js";

export const Bicicleta = new EntitySchema({
  name: "Bicicleta",
  tableName: "bicicletas",
  columns: {
    idBicicleta: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    idUsuario: {
      type: "int",
    },
    marca: {
      type: "varchar",
      lenght: 255,
      nullable: false,
    },
    modelo: {
      type: "varchar",
      lenght: 255,
      nullable: false,
    },
    color: {
      type: "varchar",
      lenght: 255,
      nullable: false,
    },
    relations: {
      usuario: {
        target: () => Usuario,
        type: "many-to-one",
        joinColumn: {
          name: "idUsuario",
        },
      },
    },
  },
});
