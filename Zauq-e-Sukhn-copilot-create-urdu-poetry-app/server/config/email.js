const nodemailer = require('nodemailer');

/**
 * Create a reusable Gmail SMTP transporter.
 *
 * Required environment variables:
 *   GMAIL_USER  – your Gmail address (e.g. you@gmail.com)
 *   GMAIL_APP_PASSWORD – a Google App Password (NOT your regular password)
 *
 * How to generate an App Password:
 *   1. Enable 2-Step Verification on your Google account
 *   2. Go to https://myaccount.google.com/apppasswords
 *   3. Select "Mail" → "Other (Custom name)" → name it "Zauq-e-Sukhn"
 *   4. Copy the 16-character password and paste it in your .env file
 */
const createTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn(
      '[Email] GMAIL_USER and GMAIL_APP_PASSWORD not set — emails will not be sent.'
    );
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

let transporter = null;

const getTransporter = () => {
  if (!transporter) transporter = createTransporter();
  return transporter;
};

/**
 * Send a password-reset email containing a 6-digit code.
 *
 * @param {string} to    – recipient email
 * @param {string} code  – 6-digit reset code
 * @returns {Promise<boolean>} true if sent, false if email is not configured
 */
const sendResetCodeEmail = async (to, code) => {
  const t = getTransporter();
  if (!t) return false;

  try {
    const mailOptions = {
      from: `"ذوقِ سخن — Zauq-e-Sukhn" <${process.env.GMAIL_USER}>`,
      to,
      subject: 'Password Reset Code — Zauq-e-Sukhn',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, sans-serif; max-width: 520px; margin: 0 auto; background: #1a1a2e; border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #d97706, #b45309); padding: 28px 24px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 24px; font-family: 'Noto Nastaliq Urdu', serif;">ذوقِ سخن</h1>
            <p style="color: #fef3c7; margin: 6px 0 0; font-size: 13px;">Zauq-e-Sukhn — Urdu Poetry Platform</p>
          </div>

          <!-- Body -->
          <div style="padding: 32px 24px; color: #e5e7eb;">
            <p style="margin: 0 0 8px; font-size: 15px;">Assalamu Alaikum,</p>
            <p style="margin: 0 0 20px; font-size: 15px;">You requested a password reset. Use the code below to set a new password. This code will expire in <strong>15 minutes</strong>.</p>

            <!-- Code box -->
            <div style="background: #2d2d44; border: 2px solid #d97706; border-radius: 10px; padding: 20px; text-align: center; margin: 0 0 24px;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #f59e0b; font-family: monospace;">${code}</span>
            </div>

            <p style="margin: 0 0 6px; font-size: 13px; color: #9ca3af;">If you did not request this, you can safely ignore this email.</p>
          </div>

          <!-- Footer -->
          <div style="background: #111827; padding: 16px 24px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #6b7280;">© ${new Date().getFullYear()} Zauq-e-Sukhn. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await t.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error('[Email] Failed to send reset code:', err.message);
    // Reset the transporter so it re-creates on next attempt
    transporter = null;
    return false;
  }
};

module.exports = { sendResetCodeEmail };
