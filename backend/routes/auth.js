import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { sendVerificationEmail } from "../utils/email.js";

const router = express.Router();

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "supersecretportfoliojwtkey123!", {
    expiresIn: "30d",
  });
};

// @desc    Register a new user (Signup)
// @route   POST /api/auth/signup
// @access  Public
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      // If user exists but is not verified, we can let them register again or update their code.
      // For simplicity, if they exist and are not verified, we'll recreate the verification code and resend it.
      if (!userExists.isVerified) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        userExists.name = name;
        // Hash password
        const salt = await bcrypt.genSalt(10);
        userExists.password = await bcrypt.hash(password, salt);
        userExists.verificationCode = code;
        userExists.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
        await userExists.save();

        const previewUrl = await sendVerificationEmail(userExists.email, code);

        return res.status(200).json({
          message: "Account already exists but was unverified. A new verification code has been sent.",
          email: userExists.email,
          previewUrl,
        });
      }

      return res.status(400).json({ message: "User already exists with this email" });
    }

    // 2. Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationCode: code,
      verificationCodeExpires,
      isVerified: false,
    });

    // 5. Send Verification Email
    const previewUrl = await sendVerificationEmail(user.email, code);

    res.status(201).json({
      message: "Registration successful. Please verify your email.",
      email: user.email,
      previewUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration. Please try again." });
  }
});

// @desc    Verify email with 6-digit code
// @route   POST /api/auth/verify
// @access  Public
router.post("/verify", async (req, res) => {
  const { email, code } = req.body;

  try {
    if (!email || !code) {
      return res.status(400).json({ message: "Please provide email and verification code" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // Check code matches and has not expired
    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (new Date() > user.verificationCodeExpires) {
      return res.status(400).json({ message: "Verification code has expired. Please sign up again to get a new code." });
    }

    // Mark as verified
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully. You can now log in.",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during email verification" });
  }
});

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check verification status
    if (!user.isVerified) {
      // Re-generate and resend code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      user.verificationCode = code;
      user.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      const previewUrl = await sendVerificationEmail(user.email, code);

      return res.status(403).json({
        message: "Email is not verified. A verification code has been sent to your email.",
        isVerified: false,
        email: user.email,
        previewUrl,
      });
    }

    res.status(200).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// @desc    Get user profile (Session Check)
// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error checking session" });
  }
});

export default router;
