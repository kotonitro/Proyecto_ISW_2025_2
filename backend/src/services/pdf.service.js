import PDFDocument from "pdfkit";

export function generateInformePdf(informe) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
    doc.on("error", reject);
    //Contenido del PDF
    doc.fontSize(16).text(`Informe de Gestión - ID: ${informe.idInforme}`, {
      align: "center",
    });
    doc.moveDown();
    doc
      .fontSize(12)
      .text(
        `Fecha de Creación: ${informe.fechaCreacion ? informe.fechaCreacion.toDateString() : "N/A"}`,
      );
    doc.text(
      `Encargado: ${informe.encargado ? informe.encargado.nombre : "No asignado"}`,
    );
    doc.moveDown();
    doc.fontSize(14).text("Detalles del Informe:", { underline: true });
    doc
      .fontSize(10)
      .text(informe.detalle || "No hay detalles proporcionados.", {
        align: "justify",
      });
    doc.end();
  });
}
