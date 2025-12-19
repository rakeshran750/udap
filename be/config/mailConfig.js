import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config();

const mailTransporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: process.env.MAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER, // your email
    pass: process.env.MAIL_PASS  // app password
  }
});

// Verify connection (optional but recommended)
mailTransporter.verify((error, success) => {
  if (error) {
    console.error('Mail server error:', error);
  } else {
    console.log('Mail server is ready to send emails');
  }
});

export default mailTransporter