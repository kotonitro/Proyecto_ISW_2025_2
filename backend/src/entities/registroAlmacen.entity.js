import { EntitySchema } from "typeorm";

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
    relations: {
      bicicletero: {
        type: "many-to-one",
        target: "bicicletero",
        joinColumn: {
          name: "idBicicletero",
        },
      },
      bicicleta: {
        type: "many-to-one",
        target: "bicicleta",
        joinColumn: {
          name: "idBicicleta",
        },
      },
    },
  },
});
