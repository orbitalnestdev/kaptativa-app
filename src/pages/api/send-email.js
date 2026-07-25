import nodemailer from 'nodemailer';

export const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, whatsapp, email, business, message, tags, challenge } = data;

    // Check configuration
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_TO) {
      console.warn("SMTP credentials missing. Email not sent.");
      return new Response(JSON.stringify({ 
        success: false, 
        message: "SMTP not configured" 
      }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Build email content
    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2b2b2b;">Nuevo Lead desde la web Kaptativa</h2>
        <p>Has recibido un nuevo mensaje a través de los formularios de la web:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; width: 120px;">Nombre</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${name || 'No especificado'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">WhatsApp</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${whatsapp || 'No especificado'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Empresa/Web</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${business || 'No especificado'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Servicio</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${tags || 'General'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Mensaje</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${message || challenge || 'Sin mensaje'}</td>
          </tr>
        </table>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">Este es un mensaje automático de tu sistema Kaptativa.</p>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Kaptativa Web" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO,
      subject: `Nuevo Lead 🚀 - ${name} (${tags || 'Contacto'})`,
      html: htmlContent,
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email sent successfully" 
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: error.message || "Failed to send email" 
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
