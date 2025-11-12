import { AppDataSource } from "../config/configDB.js"; 
import { Notificacion } from '../entities/notificacion.entity.js'; 
import { handleSuccess, handleErrorServer } from "../Handlers/responseHandlers.js";

//Crear notificacion
export const createNotificacion = async (req, res) => {
  const { mensaje, bicicleteroId } = req.body;

  try {
    const notificacionRepo = AppDataSource.getRepository(Notificacion);
    
    const nuevaNotificacion = notificacionRepo.create({
      mensaje: mensaje,
      bicicleteroId: bicicleteroId,
    });

    await notificacionRepo.save(nuevaNotificacion);
    
    return handleSuccess(res, 201, 'Notificación enviada exitosamente', nuevaNotificacion);

  } catch (error) {
    console.error('Error al crear notificación:', error); 
    return handleErrorServer(res, 500, 'Error al crear la notificación', error.message);
  }
};


//Obtener todas las notificaciones no leidas
export const getNotificaciones = async (req, res) => {
  console.log(`Guardia (ID: ${req.user.id}) está pidiendo notificaciones.`);
  
  try {
    const notificacionRepo = AppDataSource.getRepository(Notificacion);
    
    const notificaciones = await notificacionRepo.find({ 
      where: { leida: false },
      order: { createdAt: 'DESC' } 
    });

    return handleSuccess(res, 200, 'Notificaciones obtenidas exitosamente', notificaciones);

  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    return handleErrorServer(res, 500, 'Error al obtener las notificaciones', error.message);
  }
};