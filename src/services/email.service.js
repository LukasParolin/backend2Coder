const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de contraseña - Ecommerce',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Recuperación de contraseña</h2>
          <p>Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Restablecer Contraseña
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            <strong>Importante:</strong> Este enlace expirará en 1 hora por seguridad.
          </p>
          
          <p style="color: #666; font-size: 14px;">
            Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
          </p>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
            <a href="${resetUrl}">${resetUrl}</a>
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true, message: 'Email enviado correctamente' };
    } catch (error) {
      console.error('Error al enviar email:', error);
      throw new Error('Error al enviar el email de recuperación');
    }
  }

  async sendWelcomeEmail(email, firstName) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '¡Bienvenido a nuestro Ecommerce!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">¡Bienvenido ${firstName}!</h2>
          <p>Tu cuenta ha sido creada exitosamente en nuestro ecommerce.</p>
          <p>Ahora puedes explorar nuestros productos y realizar compras.</p>
          <p>¡Gracias por unirte a nosotros!</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true, message: 'Email de bienvenida enviado' };
    } catch (error) {
      console.error('Error al enviar email de bienvenida:', error);
      // No lanzamos error para que no afecte el registro del usuario
      return { success: false, message: 'Error al enviar email de bienvenida' };
    }
  }

  async sendTicketEmail(email, ticket) {
    const productsHtml = ticket.products.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Confirmación de compra - Ticket ${ticket.code}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">¡Compra confirmada!</h2>
          <p>Tu compra ha sido procesada exitosamente.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Detalles del Ticket</h3>
            <p><strong>Código:</strong> ${ticket.code}</p>
            <p><strong>Fecha:</strong> ${new Date(ticket.purchase_datetime).toLocaleString()}</p>
            <p><strong>Total:</strong> $${ticket.amount.toFixed(2)}</p>
          </div>

          <h3>Productos comprados:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Producto</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Cantidad</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Precio Unit.</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${productsHtml}
            </tbody>
          </table>

          <p style="margin-top: 30px;">¡Gracias por tu compra!</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true, message: 'Email de confirmación enviado' };
    } catch (error) {
      console.error('Error al enviar email de ticket:', error);
      return { success: false, message: 'Error al enviar email de confirmación' };
    }
  }
}

module.exports = EmailService; 