import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const router = express.Router();
import Host from "../models/hostRegistration_Model.js";

// JWT Secret - Enforce strong secret requirement
const JWT_SECRET = (() => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET must be at least 32 characters long for production security",
    );
  }
  return secret;
})();

router.post("/login", async (req, res) => {
  try {
    console.log("Host login request from:", req.get("origin"));
    console.log(
      "Host login attempt for email:",
      userName ? userName.substring(0, 3) + "***" : "undefined",
    );

    const { userName, passCode } = req.body;

    // Validate input
    if (!userName || !passCode) {
      return res.status(400).json({
        success: false,
        message: "Email and passcode are required",
      });
    }

    // Find host by email only (secure password comparison will follow)
    const host = await Host.findOne({
      where: {
        email: userName,
      },
    });

    // Check if host exists and verify password
    if (!host) {
      console.log("Host not found for email");
      return res.status(401).json({
        success: false,
        message: "Invalid email or passcode",
      });
    }

    // Verify passCode using bcrypt - handle both new hashed and legacy numeric codes
    let isPasswordValid = false;

    try {
      // First try bcrypt comparison for new hashed passwords
      isPasswordValid = await bcrypt.compare(
        passCode.toString(),
        host.passCode,
      );
    } catch (error) {
      // If bcrypt fails, check if it's a legacy numeric passCode (migration period)
      if (
        typeof host.passCode === "string" &&
        host.passCode === passCode.toString()
      ) {
        isPasswordValid = true;
        console.log(
          "Legacy password detected - will be upgraded on next registration update",
        );
      }
    }

    if (!isPasswordValid) {
      console.log("Invalid passcode provided");
      return res.status(401).json({
        success: false,
        message: "Invalid email or passcode",
      });
    }

    console.log("Host found:", {
      id: host.id,
      email: host.email,
      registrationStatus: host.registrationStatus,
    });

    // Check registration status
    const status = host.registrationStatus?.toLowerCase();
    console.log("Registration status (lowercase):", status);

    if (status === "pending") {
      return res.status(403).json({
        success: false,
        message:
          "Your registration is still pending approval. Please wait for admin verification.",
      });
    }

    if (status === "rejected") {
      return res.status(403).json({
        success: false,
        message:
          "Your registration has been rejected. Please contact support for more information.",
      });
    }

    if (status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Please contact support.",
      });
    }

    if (status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is not active. Please contact support.",
      });
    }

    // Successful login - Generate JWT token
    const tokenPayload = {
      id: host.id,
      email: host.email,
      firstName: host.firstName,
      lastName: host.lastName,
      role: "host",
    };

    const token = jwt.sign(
      tokenPayload,
      JWT_SECRET,
      { expiresIn: "24h" }, // Token expires in 24 hours
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: host.id,
        email: host.email,
        firstName: host.firstName,
        lastName: host.lastName,
        city: host.city,
        streetAddress: host.streetAddress,
        country: host.country,
        province: host.province,
        zipCode: host.zipCode,
        registrationStatus: host.registrationStatus,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: err.message,
    });
  }
});

export default router;
