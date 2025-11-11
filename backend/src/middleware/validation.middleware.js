/**
 * Middleware para validar el body de las peticiones usando Joi
 */
export function validationMiddleware(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        message: "Error de validación",
        errors: details,
      });
    }

    req.body = value;
    next();
  };
}
