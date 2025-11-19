"use strict";
import Joi from "joi";

export const bicicleteroValidation = Joi.object({
  
  ubicacion: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "La ubicación es obligatoria.",
      "string.base": "La ubicación debe ser una cadena de texto.",
      "any.required": "La ubicación es obligatoria."
    }),

  capacidad: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "La capacidad debe ser un número.",
      "number.integer": "La capacidad debe ser un número entero.",
      "number.positive": "La capacidad debe ser un número positivo.",
      "any.required": "La capacidad es obligatoria."
    }),
}).required().messages({"any.required": "La petición no puede estar vacia."});

export const bicicleteroUpdateValidation = bicicleteroValidation.fork(
  ["ubicacion", "capacidad"],
  (schema) => schema.optional()
).min(1).required().messages({
  "object.min": "Debe haber al menos un campo para actualizar.",
  "any.required": "La petición no puede estar vacia."});