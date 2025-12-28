import {createInforme,getInformeById,deleteInforme,getInformes,updateInforme} from "../services/informe.service.js";
import { generateInformePdf } from "../services/pdf.service.js";
import {handleSuccess,handleErrorClient,handleErrorServer} from "../handlers/responseHandlers.js";
import {informeValidation,informeUpdateValidation} from "../validations/informe.validation.js";
import {createDocumentos} from "../services/documento.service.js"
import { getInformeZip } from "../services/informe.service.js";

export async function handleCreateInforme(req, res) {
  const informeData = req.body;
  const archivos = req.files; 
  informeData.fechaInforme = new Date();

  try {
    const { error, value } = informeValidation.validate(informeData, {
      abortEarly: false,
    });

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.context.key,
        message: detail.message.replace(/['"]/g, ""),
      }));
      return handleErrorClient(res, 400, "Error de validacion en los datos.", errorDetails);
    }

    if (archivos && archivos.length > 0) {
      value.documentos = archivos.map((archivo) => ({
        nombreOriginal: archivo.originalname,
        ruta: archivo.filename, 
        mimetype: archivo.mimetype,
      }));
    }

    const newInforme = await createInforme(value);
    
    handleSuccess(res, 201, "Informe creado exitosamente", newInforme);
  } catch (error) {
    handleErrorServer(res, 500, "Error interno al crear el informe", error.message);
  }
}

export async function handleDeleteInforme(req, res) {
  const { id } = req.params;
  const idInforme = parseInt(id, 10);

  if (isNaN(idInforme)) {
    return handleErrorClient(res, 400, "El ID del informe debe ser un número.");
  }
  try {
    const Informe = await getInformeById(idInforme);
    if (!Informe) {
      return handleErrorClient(res, 404, "Informe no encontrado.");
    }
    await deleteInforme(idInforme);
    handleSuccess(res, 200, "Informe eliminado correctamente.");
  } catch (error) {
    handleErrorServer(res,500,"Error interno al eliminar el informe.",error.message);
  }
}
export async function handleGetInformes(req, res) {
  try {
    const Informes = await getInformes();
    return handleSuccess(res,200,"Informes obtenidos correctamente",Informes);
  } catch (error) {
    return handleErrorServer(res,500,"Error interno al obtener los informes",error.message);
  }
}

export async function handleUpdateInforme(req, res) {
  const { id } = req.params;
  const idInforme = parseInt(id, 10);
  const informeData = req.body;

  if (isNaN(idInforme)) {
    return handleErrorClient(res, 400, "El ID del informe debe ser un numero");
  }
  try {
    const { error, value } = informeUpdateValidation.validate(informeData, {
      abortEarly: false,
    });

    if (error) {
      const errorDetails = error.details.map((details) => ({
        field: details.context.key,
        message: details.message.replace(/['"]/g, ""),
      }));
      return handleErrorClient(res,400,"Error al validar datos",errorDetails);
    }
    const Informe = await getInformeById(idInforme);
    if (!Informe) {
      return handleErrorClient(res, 404, "Informe no encontrado");
    }
    const updatedInforme = await updateInforme(idInforme, value);
    handleSuccess(res, 200, "Informe actualizado con exito", updatedInforme);
  } catch (error) {
    handleErrorServer(res,500,"Error al actualizar el informe",error.message);
  }
}
 export async function handleDownloadInformePdf(req, res){
   const { id } = req.params;
     const idInforme = parseInt(id, 10);
     if (isNaN(idInforme)) {
       return handleErrorClient(res, 400, "El ID del informe debe ser un número.");
     }
     try {
       const Informe = await getInformeById(idInforme);
       if (!Informe) {
         return handleErrorClient(res, 404, "Informe no encontrado para generar PDF.");
       }
       const pdfBuffer = await generateInformePdf(Informe);
   
       res.setHeader("Content-Type", "application/pdf");
       res.setHeader("Content-Disposition", `attachment; filename=informe_${idInforme}.pdf`);
       res.setHeader("Content-Length", pdfBuffer.length);
   
       res.send(pdfBuffer);
     } catch (error) {
       handleErrorServer(res, 500, "Error interno al generar el PDF", error.message);
     }
}

export async function handleDownloadInformeZip(req, res) {
  try {
    const { id } = req.params;
    const { archive, idInforme } = await getInformeZip(id);
    res.attachment(`Informe_Completo_${idInforme}.zip`);
    res.setHeader("Content-Type", "application/zip");
    archive.on("error", (err) => {
      console.error("Error comprimiendo:", err);
      res.status(500).send({ error: "Error al generar el ZIP" });
    });
    archive.pipe(res);
    await archive.finalize();

  } catch (error) {
    console.error("Error en downloadZip:", error);
    if (error.message === "Informe no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}