import Joi from "joi";

const validarRut = (value, helpers) => {
  if (!value) return helpers.error("any.required");

  const rutLimpio = value.replace(/\./g, "").replace(/-/g, "").toLowerCase();

  if (!/^[0-9]+[0-9kK]{1}$/.test(rutLimpio)) {
    return helpers.message(
      "El RUT tiene caracteres inválidos (solo números y K)."
    );
  }

  if (rutLimpio.length < 8) {
    return helpers.message("El RUT es demasiado corto.");
  }

  // Separamos número y dígito verificador
  const cuerpo = rutLimpio.slice(0, -1);
  const dvIngresado = rutLimpio.slice(-1);

  // MATEMÁTICA DEL RUT
  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * multiplo;
    if (multiplo < 7) multiplo += 1;
    else multiplo = 2;
  }

  const dvEsperado = 11 - (suma % 11);
  let dvCalculado = "";

  if (dvEsperado === 11) dvCalculado = "0";
  else if (dvEsperado === 10) dvCalculado = "k";
  else dvCalculado = dvEsperado.toString();

  // Comparamos lo calculado con lo que escribió el usuario
  if (dvCalculado !== dvIngresado) {
    return helpers.message(
      "El RUT es inválido (Dígito verificador incorrecto)."
    );
  }

  return value;
};

export const crearNotificacion = Joi.object({
  mensaje: Joi.string().min(5).max(255).required().messages({
    "any.required": "El mensaje es obligatorio",
    "string.min": "El mensaje debe tener al menos 5 caracteres",
    "string.empty": "El mensaje no puede estar vacío",
  }),

  bicicleteroId: Joi.number().integer().min(1).required().messages({
    "any.required": "Debe seleccionar un bicicletero",
    "number.base": "El ID del bicicletero debe ser un número",
    "number.min": "El ID del bicicletero no es válido",
  }),

  rutSolicitante: Joi.string().required().custom(validarRut).messages({
    "any.required": "El RUT es obligatorio.",
  }),
});
