import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();
import Host from "../models/hostRegistration_Model.js";

// JWT Secret - In production, use environment variable
const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

router.post("/login", async (req, res) => {
  try {
    console.log("Login request received from:", req.get("origin"));
    console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);

    const { userName, passCode } = req.body;

    // Validate input
    if (!userName || !passCode) {
      return res.status(400).json({
        success: false,
        message: "Email and passcode are required",
      });
    }

    // Find host by email and passcode
    const host = await Host.findOne({
      where: {
        email: userName,
        passCode: passCode,
      },
    });

    // Check if host exists
    if (!host) {
      console.log("Host not found with provided credentials");
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
      { expiresIn: "24h" } // Token expires in 24 hours
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
