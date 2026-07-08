import express from "express";
import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

const router = express.Router();

// @desc    Submit a contact form message
// @route   POST /api/contact
// @access  Public
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // 1. Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    // 2. Save submission in DB
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    // 3. Send notification email to the portfolio owner if configured
    if (process.env.EMAIL_USER && process.env.NOTIFICATION_EMAIL) {
      try {
        const transporter = nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE || "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
          to: process.env.NOTIFICATION_EMAIL,
          subject: `New Portfolio Message: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
              <h2 style="color: #06B6D4;">New Contact Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Subject:</strong> ${subject}</p>
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; background-color: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #f3f4f6;">${message}</p>
            </div>
          `,
        });
        console.log(`[Contact Form] Notification email sent to ${process.env.NOTIFICATION_EMAIL}`);
      } catch (mailError) {
        console.error("Failed to send contact notification email:", mailError.message);
      }
    }

    res.status(201).json({
      success: true,
      message: "Message saved successfully. Thank you!",
      contact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error saving contact message. Please try again." });
  }
});

export default router;
