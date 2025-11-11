import Joi from "joi";

export const crearNotificacion = Joi.object({
  // Valida que el mensaje sea un string con mínimo 5 caracteres
  mensaje: Joi.string().min(5).max(255).required().messages({
    "any.required": "El mensaje es obligatorio",
    "string.min": "El mensaje debe tener al menos 5 caracteres",
    "string.empty": "El mensaje no puede estar vacío",
  }),

  // Valida que el bicicleteroId sea un número entero y positivo
  bicicleteroId: Joi.number().integer().min(1).required().messages({
    "any.required": "Debe seleccionar un bicicletero",
    "number.base": "El ID del bicicletero debe ser un número",
    "number.min": "El ID del bicicletero no es válido",
  }),
});
