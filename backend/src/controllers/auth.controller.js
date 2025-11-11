import { loginEncargado } from "../services/auth.service.js";
import { handleSuccess, handleErrorClient} from "../handlers/responseHandlers.js";

export async function login(req, res) {
  try {
    const { email, contrasena } = req.body;
    
    if (!email || !contrasena) {
      return handleErrorClient(res, 400, "Email y contraseña son requeridos");
    }
    
    const data = await loginEncargado(email, contrasena);
    handleSuccess(res, 200, "Login exitoso", data);
  } catch (error) {
    handleErrorClient(res, 401, error.message);
  }
}