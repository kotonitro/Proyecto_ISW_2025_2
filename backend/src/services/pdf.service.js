import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoPath = path.join(__dirname, "../../../frontend/src/images/logoUBB.png");

export function generateInformePdf(Informe) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ 
      size: "A4", 
      margin: 50,
      bufferPages: true 
    });

    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
    doc.on("error", reject);

    //  ENCABEZADO

    let headerBottomY = 100; 

    if (fs.existsSync(logoPath)) {
      try {
        doc.image(logoPath, 50, 35, { width: 70 });
        
        headerBottomY = 35 + 100; 

      } catch (error) {
        console.warn("Error cargando el logo:", error.message);
      }
    }

    doc.text("", 0, 45); 
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#003da5")
       .text("UNIVERSIDAD DEL BÍO-BÍO", { align: "right" })
       .text("Sistema de Gestión de Incidentes", { align: "right" });
    
    doc.y = headerBottomY + 20; 

    // Título 
    doc.font("Helvetica-Bold").fontSize(20).fillColor("black")
       .text(`REPORTE DE INCIDENTE #${Informe.idInforme}`, { align: "center" });
    
    doc.moveDown(0.5);
    doc.strokeColor("#003da5").lineWidth(2)
       .moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    
    doc.moveDown(1);


    // TABLA DE DATOS GENERALES
    
    const startX = 50;
    let currentY = doc.y;
    const col1 = startX;
    const col2 = 380;

    const row = (label, value, x, y) => {
        doc.font("Helvetica-Bold").fontSize(11).fillColor("#333").text(label, x, y);
        doc.font("Helvetica").fontSize(11).fillColor("#555").text(value, x + 100, y);
    };

    const fechaTexto = Informe.fechaInforme 
      ? new Date(Informe.fechaInforme).toLocaleDateString("es-CL", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) 
      : "N/A";
    
    row("Fecha:", fechaTexto, col1, currentY);
    row("Tipo:", Informe.tipoIncidente || "No especificado", col2, currentY);

    doc.moveDown(2);
    currentY = doc.y;

    const nombreEncargado = Informe.encargados ? Informe.encargados.nombre : "Sin asignar";
    row("Encargado:", nombreEncargado, col1, currentY);
    
    doc.moveDown(3);

    // DESCRIPCIÓN 
  
    const descY = doc.y;
    doc.rect(50, descY, 495, 25).fill("#f0f0f0");
    
    doc.fillColor("black").font("Helvetica-Bold").fontSize(12)
       .text("DETALLE DE LOS HECHOS", 60, descY + 7);

    doc.moveDown(1);
    
    doc.font("Helvetica").fontSize(11).fillColor("black").lineGap(4)
       .text(Informe.descripcion || "No se ha proporcionado una descripción detallada.", 50, doc.y + 10, {
         align: "justify",
         width: 495
       });


    // PIE DE PÁGINA 

    const range = doc.bufferedPageRange();
    const pageHeight = doc.page.height;
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      doc.fontSize(8).fillColor("grey")
         .text(
            `Generado automáticamente el ${new Date().toLocaleString()} - Página ${i + 1} de ${range.count}`,
            50,
            pageHeight - 50,
            { align: "center" }
         );
    }

    doc.end();
  });
}