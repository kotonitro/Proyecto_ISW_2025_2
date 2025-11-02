import { EntitySchema } from "typeorm";

export const Bicicleta = new EntitySchema({
  name: "Bicicleta",
  tableName: "bicicletas",
  columns: {
    id_bicicleta: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    id_usuario: {
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
        target: "Usuario",
        type: "many-to-one",
        joinColumn: {
          name: "id_usuario",
        },
      },
    },
  },
});
