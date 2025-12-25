import PDFDocument from "pdfkit";

export function generateInformePdf(Informe) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
    doc.on("error", reject);

    // Título
    doc.fontSize(18).text(`Informe de Gestión - ID: ${Informe.idInforme}`, {
      align: "center",
    });
    doc.moveDown();

    // Datos generales
    doc.fontSize(12);
    
    // Fecha 
    const fechaTexto = Informe.fechaInforme 
      ? new Date(Informe.fechaInforme).toLocaleDateString() 
      : "N/A";
    doc.text(`Fecha del Informe: ${fechaTexto}`);

    // Tipo de Incidente
    doc.text(`Tipo de Incidente: ${Informe.tipoIncidente}`);

    // Encargado 
    const nombreEncargado = Informe.encargados ? Informe.encargados.nombre : "No asignado";
    doc.text(`Encargado: ${nombreEncargado}`);
    
    doc.moveDown();
    
    // Descripción 
    doc.fontSize(14).text("Descripción del Incidente:", { underline: true });
    doc.moveDown(0.5);
    
    doc.fontSize(11).text(Informe.descripcion || "Sin descripción.", {
      align: "justify",
    });
    doc.end();
  });
}