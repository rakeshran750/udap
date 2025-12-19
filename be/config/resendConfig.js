import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

// Optional test function
export const sendTestMail = async () => {
  try {
    const response = await resend.emails.send({
      from: "Your App <onboarding@resend.dev>", // must be verified
      to: ["test@example.com"],
      subject: "Resend Email Test",
      html: "<p>Mail server is ready 🚀</p>",
    });

    console.log("Email sent:", response);
  } catch (error) {
    console.error("Resend mail error:", error);
  }
};

export default resend;