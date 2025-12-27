import { EntitySchema } from "typeorm";

export const Notificacion = new EntitySchema({
  name: "Notificacion",
  tableName: "notificaciones",
  columns: {
    notificacionId: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    mensaje: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    rutSolicitante: {
            type: "varchar",
            length: 12, 
            nullable: false,
        },
    estado: {
      type: "enum",
      enum: ["Pendiente", "En Camino", "Finalizada"],
      default: "Pendiente",
      nullable: false,
    },
    fechaCreacion: {
      type: "timestamp",
      createDate: true,
      name: "fecha_creacion",
    },
    fechaActualizacion: {
      type: "timestamp",
      updateDate: true,
      name: "fecha_actualizacion",
    },
  },
  relations: {
    bicicletero: {
      type: "many-to-one",
      target: "Bicicletero",
      joinColumn: {
        name: "bicicletero_id",
      },
      nullable: false,
    },
    encargado: {
      type: "many-to-one",
      target: "Encargado",
      joinColumn: {
        name: "encargado_id",
      },
      nullable: true,
    },
  },
});
