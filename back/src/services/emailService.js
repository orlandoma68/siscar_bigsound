const nodemailer = require('nodemailer')
const dotenv = require('dotenv').config()

let transporter = null

const obtenerTransportador = () => {
    if (!process.env.SMTP_HOST) return null
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: process.env.SMTP_USER ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            } : undefined
        })
    }
    return transporter
}

const enviarCorreo = async ({ to, subject, html }) => {
    const transporterActual = obtenerTransportador()
    if (!transporterActual) return { modoDev: true, enviado: false }
    await transporterActual.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        html
    })
    return { modoDev: false, enviado: true }
}

const enviarCorreoRestablecimiento = async ({ to, link }) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #111827; margin-bottom: 16px;">Restablecer contrasena</h2>
            <p style="color: #4b5563; line-height: 1.6;">Hola, recibimos una solicitud para restablecer tu contrasena. Haz clic en el boton de abajo para crear una nueva. El enlace es valido por 30 minutos.</p>
            <p style="text-align: center; margin: 24px 0;">
                <a href="${link}" style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; display: inline-block;">Restablecer contrasena</a>
            </p>
            <p style="color: #9ca3af; font-size: 0.875rem;">Si no solicitaste este cambio, ignora este correo.</p>
        </div>
    `
    return enviarCorreo({ to, subject: 'Restablecer contrasena - Siscar', html })
}

module.exports = { enviarCorreo, enviarCorreoRestablecimiento }
