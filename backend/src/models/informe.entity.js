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
      nullable: true,
    },
    idRegistroAlmacen: {
      type: "int",
      nullable: true,
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
    documentos: {
          target: "Documento", // Nombre de la entidad hija
          type: "one-to-many", // Un informe tiene muchos documentos
          inverseSide: "informe", // Esto debe coincidir con la relación en Documento.js
          cascade: true, // Para que si borras el informe, se borren los docs (opcional)
        },
  },
});
