const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

require('dotenv').config();
sgMail.setApiKey((process.env.SENDGRID_API_KEY || "").trim());
const SENDER_EMAIL = "medicarerjo@gmail.com";

exports.sendVerificationEmail = onCall({ cors: true }, async (request) => {
  const data = request.data || {};
  const to = data.to;
  const userName = data.userName;

  if (!to || !userName) {
    throw new HttpsError("invalid-argument", "Missing recipient email or username");
  }

  const currentYear = new Date().getFullYear();

  const htmlTemplate = `
    <!DOCTYPE html> 
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
        .header { background-color: #0A6ED1; padding: 30px; text-align: center; }
        .header img { height: 45px; margin-bottom: 12px; display: block; margin-left: auto; margin-right: auto; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px; }
        .content { padding: 40px 30px; color: #334155; line-height: 1.6; font-size: 16px; }
        .content h2 { color: #0f172a; font-size: 22px; margin-top: 0; margin-bottom: 20px; }
        .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 14px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .info-box { background-color: #f0f9ff; border-left: 4px solid #0A6ED1; padding: 15px; margin: 25px 0; border-radius: 0 8px 8px 0; }
        .btn { display: inline-block; background-color: #0A6ED1; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://firebasestorage.googleapis.com/v0/b/medicare-c69ab.firebasestorage.app/o/patientreg.png?alt=media&token=68c30205-d1b4-4351-9fee-1ed7be349b78" alt="Medicare Logo" />
          <h1>Medicare</h1>
        </div>
        <div class="content">
          <h2>Welcome to Medicare, ${userName}!</h2>
          <p>Thank you for registering. We are absolutely thrilled to have you join our digital healthcare platform.</p>
          
          <div class="info-box">
            <strong>Important Step:</strong> Please ensure you verify your email address using the secure link we sent you separately from Firebase. This will fully unlock your account capabilities.
          </div>
          
          <p>With Medicare, you can easily book appointments, track your medical history, and consult with our AI medical assistant instantly.</p>
          <p>If you have any questions or need assistance navigating the dashboard, our support team is always responsive and ready to help.</p>
          
          <p style="margin-top: 30px;">Best Regards,<br><strong style="color: #0A6ED1;">The Medicare Team</strong></p>
        </div>
        <div class="footer">
          &copy; ${currentYear} Medicare Consultation Assistant.<br>All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  const msg = {
    to: to,
    from: { email: SENDER_EMAIL, name: "Medicare Support" },
    subject: "Welcome to Medicare!",
    html: htmlTemplate,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error("SendGrid Error:", error);
    throw new HttpsError("internal", "Failed to send email");
  }
});

exports.sendDoctorCredentials = onCall({ cors: true }, async (request) => {
  const data = request.data || {};
  const to = data.to;
  const doctorName = data.doctorName;
  const password = data.password;

  if (!to || !doctorName || !password) {
    throw new HttpsError("invalid-argument", "Missing recipient email or credentials");
  }

  const currentYear = new Date().getFullYear();

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
        .header { background-color: #0A6ED1; padding: 30px; text-align: center; }
        .header img { max-width: 150px; height: auto; }
        .content { padding: 40px 30px; color: #334155; line-height: 1.6; }
        .content h1 { color: #0f172a; font-size: 24px; margin-top: 0; margin-bottom: 20px; font-weight: 600; }
        .content p { font-size: 16px; margin: 0 0 20px 0; }
        .credentials { background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 30px 0; font-family: monospace; font-size: 16px; color: #0A6ED1; }
        .footer { background-color: #f8fafc; padding: 20px 30px; text-align: center; font-size: 14px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://firebasestorage.googleapis.com/v0/b/medicare-c69ab.firebasestorage.app/o/brand%2FMedCare%20Logo.png?alt=media&token=86ae46eb-52cd-43bf-b51f-2bdec10abeb9" alt="MedCare Logo" />
        </div>
        <div class="content">
          <h1>Welcome to MedCare, Dr. ${doctorName}!</h1>
          <p>Your doctor account has been successfully created by the administration team.</p>
          <p>You can now log in to your specialized dashboard to manage your appointments and communicate with patients. Please use the following credentials to access your account. We strongly recommend changing your password after your first login.</p>
          <div class="credentials">
            <strong>Email:</strong> ${to}<br/><br/>
            <strong>Temporary Password:</strong> ${password}
          </div>
          <p>If you have any questions or need assistance, please contact the administration directly.</p>
          <p>Best regards,<br>The MedCare Administration Team</p>
        </div>
        <div class="footer">
          &copy; ${currentYear} MedCare. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  const msg = {
    to,
    from: { email: SENDER_EMAIL, name: "MedCare Administration" },
    subject: "Your MedCare Doctor Account Credentials",
    html: htmlTemplate,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error("SendGrid Error:", error);
    throw new HttpsError("internal", "Failed to send credentials email");
  }
});
