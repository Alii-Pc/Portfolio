import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  const hasCreds = process.env.EMAIL_USER && process.env.EMAIL_PASS;

  if (hasCreds) {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Generate test SMTP service account from ethereal.email
    console.log("No SMTP credentials found in .env. Creating temporary Ethereal account for testing...");
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
      console.log(`Ethereal email account created:`);
      console.log(`- User: ${testAccount.user}`);
      console.log(`- Pass: ${testAccount.pass}`);
      console.log(`- Test emails will be viewable at: https://ethereal.email`);
    } catch (err) {
      console.error("Failed to create Ethereal test email account: ", err.message);
      // Fallback: create mock transporter that just logs to console
      transporter = {
        sendMail: async (options) => {
          console.log("\n--- MOCK EMAIL SEND ---");
          console.log(`To: ${options.to}`);
          console.log(`Subject: ${options.subject}`);
          console.log(`Body: ${options.text || options.html}`);
          console.log("-----------------------\n");
          return { messageId: "mock-message-id" };
        }
      };
    }
  }

  return transporter;
};

export const sendVerificationEmail = async (email, code) => {
  try {
    const mailTransporter = await getTransporter();
    const options = {
      from: process.env.EMAIL_FROM || '"Portfolio Auth" <no-reply@portfolio.com>',
      to: email,
      subject: "Verify Your Email - Portfolio Website",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #7C3AED; text-align: center;">Welcome to Ali's Portfolio!</h2>
          <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 28px; font-weight: bold; letter-spacing: 5px; color: #06B6D4;">${code}</span>
          </div>
          <p>This verification code is valid for 15 minutes. If you did not request this, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #8b93a7; text-align: center;">© ${new Date().getFullYear()} Ali Husnain Portfolio. All rights reserved.</p>
        </div>
      `,
    };

    const info = await mailTransporter.sendMail(options);
    if (info && info.messageId) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`[Email Sent] Preview URL: ${previewUrl}`);
        return previewUrl;
      }
    }
  } catch (error) {
    console.error(`Failed to send verification email: ${error.message}`);
  }
  return null;
};
