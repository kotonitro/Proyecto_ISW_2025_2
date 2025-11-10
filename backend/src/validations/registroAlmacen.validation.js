"use strict";
import Joi from "joi";

export const registroAlmacenValidation = Joi.object({
  
  fechaEntrada: Joi.date().iso().required().messages({
    "date.base": "fechaEntrada debe ser una fecha válida",
    "date.format": "fechaEntrada debe usar formato ISO (YYYY-MM-DD)",
    "any.required": "fechaEntrada es obligatoria"
  }),

  fechaSalida: Joi.date()
    .iso()
    .min(Joi.ref("fechaEntrada"))
    .optional()
    .allow(null)
    .messages({
      "date.base": "fechaSalida debe ser una fecha válida",
      "date.format": "fechaSalida debe usar formato ISO (YYYY-MM-DD)",
      "date.min": "fechaSalida no puede ser anterior a fechaEntrada"
    })
});
