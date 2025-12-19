// import mailTransporter from "../config/mailConfig.js"

// export const sendEmail = async ({
//   to,
//   subject,
//   html,
//   text
// }) => {
//   try {
//     const mailOptions = {
//       from: `${process.env.MAIL_FROM}`,
//       to,
//       subject,
//       text :"hiii",
//       html
//     };
    
//     await mailTransporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error("❌ Email sending failed:", error.message);
//     throw error;
//   }
// };



import resend from "../config/resendConfig.js";

// export const sendEmail = async ({
//   to,
//   subject,
//   html,
//   text,
// }) => {
//   try {
//     await resend.emails.send({
//       from: "rakeshran750@gmail.com",
//       to:to ,
//       subject,
//       html,
//       text,
//     });

//     console.log("✅ Email sent successfully");
//     console.log({to, subject});
//   } catch (error) {
//     console.error("❌ Email sending failed:", error);
//     throw error;
//   }
// };



export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const response = await resend.emails.send({
      from: "Udhari Khata <onboarding@resend.dev>",
      to: [to],
      subject,
      text,
      html,
    });

    return response; // 👈 IMPORTANT
  } catch (error) {
    throw error;
  }
};