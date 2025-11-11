"use strict";
import Joi from "joi";

export const bicicleteroValidation = Joi.object({
  
  ubicacion: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "La ubicación es obligatoria",
      "string.base": "La ubicación debe ser una cadena de texto",
      "any.required": "La ubicación es obligatoria"
    }),

  capacidad: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "La capacidad debe ser un número",
      "number.integer": "La capacidad debe ser un número entero",
      "number.positive": "La capacidad debe ser un número positivo",
      "any.required": "La capacidad es obligatoria"
    }),
});
