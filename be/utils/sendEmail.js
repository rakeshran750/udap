import mailTransporter from "../config/mailConfig.js"

export const sendEmail = async ({
  to,
  subject,
  html,
  text
}) => {
  try {
    const mailOptions = {
      from: `${process.env.MAIL_FROM}`,
      to,
      subject,
      text :"hiii",
      html
    };
    
    await mailTransporter.sendMail(mailOptions);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};
