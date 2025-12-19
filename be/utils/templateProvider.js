// utils/emailTemplates.js

const APP_NAME = "Udhari Khata";
const LOGO_LETTER = "उ";
const BRAND_FROM = "#f97316";
const BRAND_TO = "#ef4444";
const YEAR = new Date().getFullYear();

/**
 * Base email layout (shared shell)
 */
function baseTemplate({ title, body }) {
  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>
    </head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,Helvetica,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
              
              <!-- Header -->
              <tr>
                <td style="padding:18px;">
                  <div style="display:flex;align-items:center;gap:10px;">
                    <div style="width:42px;height:42px;border-radius:14px;
                      background:linear-gradient(135deg,${BRAND_FROM},${BRAND_TO});
                      display:flex;align-items:center;justify-content:center;">
                      <span style="color:#fff;font-weight:800;font-size:20px;">${LOGO_LETTER}</span>
                    </div>
                    <div style="font-size:18px;font-weight:800;color:#111827;">
                      ${APP_NAME}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- Card -->
              <tr>
                <td style="padding:0 18px 18px;">
                  <div style="background:#fff;border-radius:20px;
                    border:1px solid #f3f4f6;
                    box-shadow:0 10px 30px rgba(0,0,0,.08);
                    overflow:hidden;">
                    
                    <div style="height:8px;background:linear-gradient(90deg,${BRAND_FROM},${BRAND_TO});"></div>

                    <div style="padding:22px;">
                      ${body}

                      <div style="height:1px;background:#f3f4f6;margin:20px 0;"></div>

                      <div style="font-size:12px;color:#9ca3af;line-height:1.6;">
                        Made for Bharat 🇮🇳 • Simple • Fast • Reliable<br/>
                        © ${YEAR} ${APP_NAME}. All rights reserved.
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

/**
 * OTP Email Template
 */
export function getOTPEmailTemplate({ otp }) {
  return {
    subject: `${APP_NAME} • Signup OTP`,
    text: `Your ${APP_NAME} signup OTP is ${otp}. It is valid for 10 minutes.`,
    html: baseTemplate({
      title: "Signup OTP",
      body: `
        <h2 style="margin:0 0 8px;color:#111827;">Verify your account</h2>
        <p style="color:#6b7280;font-size:14px;">
          Use the OTP below to complete your signup. This OTP is valid for <b>10 minutes</b>.
        </p>

        <div style="text-align:center;margin:20px 0;">
          <div style="display:inline-block;padding:14px 22px;
            background:#fff7ed;border:1px solid #fed7aa;
            border-radius:16px;">
            <div style="font-size:12px;font-weight:700;color:#9a3412;
              letter-spacing:.08em;margin-bottom:6px;">
              ONE TIME PASSWORD
            </div>
            <div style="font-size:34px;font-weight:900;
              letter-spacing:.25em;color:#111827;">
              ${otp}
            </div>
          </div>
        </div>

        <p style="font-size:13px;color:#6b7280;">
          If you didn’t request this OTP, please ignore this email.
        </p>
      `,
    }),
  };
}

/**
 * Welcome Email Template
 */
export function getWelcomeEmailTemplate() {
  return {
    subject: `Welcome to ${APP_NAME} 🎉`,
    text: `Welcome to ${APP_NAME}. Start managing your shop credit digitally.`,
    html: baseTemplate({
      title: "Welcome",
      body: `
        <h2 style="margin:0 0 8px;color:#111827;">
          Welcome to ${APP_NAME} 🎉
        </h2>
        <p style="color:#6b7280;font-size:14px;">
          You’re all set to manage customer credit, record transactions,
          and run your shop digitally.
        </p>

        <ul style="color:#374151;font-size:14px;line-height:1.8;padding-left:18px;">
          <li>Track customer udhari easily</li>
          <li>Works in Hindi and English</li>
          <li>Simple & reliable for daily use</li>
        </ul>
      `,
    }),
  };
}

/**
 * Password Reset Email Template
 */
export function getResetPasswordEmailTemplate({ otp }) {
  return {
    subject: `${APP_NAME} • Reset Password`,
    text: `Use this code to reset your password: ${otp}. Valid for 10 minutes.`,
    html: baseTemplate({
      title: "Reset Password",
      body: `
        <h2 style="margin:0 0 8px;color:#111827;">
          Reset your password
        </h2>
        <p style="color:#6b7280;font-size:14px;">
          Use the code below to reset your password.
          This code is valid for <b>10 minutes</b>.
        </p>

        <div style="text-align:center;margin:20px 0;">
          <div style="display:inline-block;padding:14px 22px;
            background:#fff7ed;border:1px solid #fed7aa;
            border-radius:16px;">
            <div style="font-size:34px;font-weight:900;
              letter-spacing:.25em;color:#111827;">
              ${otp}
            </div>
          </div>
        </div>

        <p style="font-size:13px;color:#6b7280;">
          If you didn’t request this, please ignore this email.
        </p>
      `,
    }),
  };
}
