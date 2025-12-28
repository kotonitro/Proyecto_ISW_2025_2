import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const enviarAlertaCorreo = async (
  destinatarios,
  linkAceptar,
  bicicleteroId,
  mensajeUsuario,
) => {
  try {
    const listaCorreos = Array.isArray(destinatarios)
      ? destinatarios.join(", ")
      : destinatarios;

    const mailOptions = {
      from: '"Seguridad UBB" <no-reply@ubb.cl>',
      to: "guardias@ubb.cl",
      bcc: listaCorreos,
      subject: `Asistencia requerida en Bicicletero ${bicicleteroId}`,
      html: `
              <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <h2 style="color: #444;">Solicitud de Asistencia</h2>

                <p>Se ha reportado un problema en el <strong>Bicicletero #${bicicleteroId}</strong>.</p>

                <p style="background-color: #f4f4f4; padding: 10px; border-left: 3px solid #555;">
                  <strong>Mensaje:</strong> "${mensajeUsuario}"
                </p>

                <p style="margin-top: 25px;">
                  <a href="${linkAceptar}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-size: 14px;">
                    Aceptar solicitud
                  </a>
                </p>

                <p style="font-size: 12px; color: #888; margin-top: 20px;">
                  Si no puedes atender esta solicitud, ignora este correo.
                </p>
              </div>
            `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado con ID: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
    return false;
  }
};
