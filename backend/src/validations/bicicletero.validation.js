"use strict";
import Joi from "joi";

export const bicicleteroValidation = Joi.object({

  ubicacion: Joi.string()
    .trim()
    .max(50)
    .required()
    .messages({
      "string.empty": "La ubicación es obligatoria",
      "string.max": "La ubicación no puede exceder los 50 caracteres",
      "string.base": "La ubicación debe ser una cadena de texto",
      "any.required": "La ubicación es obligatoria"
    }),

  capacidad: Joi.number()
    .integer()
    .positive()
    .max(15) 
    .required()
    .messages({
      "number.base": "La capacidad debe ser un número",
      "number.integer": "La capacidad debe ser un número entero",
      "number.positive": "La capacidad debe ser un número positivo",
      "number.max": "La capacidad no puede ser mayor a 15",
      "any.required": "La capacidad es obligatoria"
    }),

  //opcion actualizar
  idBicicletero: Joi.number()
    .integer()
    .positive()
});
