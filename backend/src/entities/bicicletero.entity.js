import { EntitySchema } from "typeorm"


export const Usuario = new EntitySchema({
    name: "Bicicletero",
    tableName: "bicicleteros",
    columns: {
        id_bicicletero: {
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
            lenght: 255,
            nullable: false,
        },
        monitoreo: {
            type: "bool",
            nullable: false,
        },
    }
});