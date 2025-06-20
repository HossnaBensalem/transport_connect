import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendNotificationEmail = async (to, subject, text) => {
  try {
    if (!process.env.EMAIL_USER) {
      console.log('Email not configured, skipping notification');
      return;
    }

    await transporter.sendMail({
      from: `"TransportConnect" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">TransportConnect</h2>
          <p>${text}</p>
          <p>Best regards,<br>TransportConnect Team</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};
