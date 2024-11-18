import nodemailer from 'nodemailer';

const emailOlvidePassword = async (data) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { email, nombre, token } = data;

    // send mail with defined transport object

    // send mail with defined transport object

    

    const info = await transporter.sendMail({
        from: "Veterinaria -  <tu-correo@dominio.com>",
        to: email,
        subject: 'Reestablece tu contraseña - Veterinaria',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; color: #333;">
                <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                    <h1 style="color: #4CAF50; font-size: 24px; margin-bottom: 20px;">Veterinaria - Reestablecer contraseña</h1>
                    <p style="font-size: 16px; line-height: 1.5;">Hola ${nombre},</p>
                    <p style="font-size: 16px; line-height: 1.5;">Has solicitado reestablecer tu contraseña. Haz clic en el siguiente enlace:</p>
                    <p style="text-align: center; margin-top: 20px;">
                        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reestablecer contraseña</a>
                    </p>

                    <p> Si tu no solicitaste este cambio, ignora este mensaje.</p>
                </div>
            </div>
        `
    });
    
    console.log('Message sent: %s', info.messageId);
};

export default emailOlvidePassword;