import { EntitySchema } from "typeorm";

export const Informe = new EntitySchema({
  name: "Informe",
  tableName: "informes",
  columns: {
    idInforme: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    idEncargado: {
      type: "int",
    },
    idRegistroAlmacen: {
      type: "int",
    },
    tipoIncidente: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    descripcion: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    fechaInforme: {
      type: "date",
      nullable: false,
    },
  },
  relations: {
    encargados: {
      target: "Encargado",
      type: "many-to-one",
      joinColumn: {
        name: "idEncargado",
      },
    },
    registrosAlmacen: {
      target: "RegistroAlmacen",
      type: "many-to-one",
      joinColumn: {
        name: "idRegistroAlmacen",
      },
    },
  },
});
