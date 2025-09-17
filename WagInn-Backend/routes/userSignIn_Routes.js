import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import User from "../models/userRegistration_Model.js";
import jwt from "jsonwebtoken";
// import { use } from "react";
import dotenv from "dotenv";
dotenv.config();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "change-jwt-key-in-prod";

router.post("/login", async (req, res) => {
  try {
    console.log("Login request received from: ", req.get("origin"));
    console.log("Request headers: ", req.headers);
    console.log("Request Body: ", req.body);

    const { userName, password } = req.body;

    //Input validation
    if (!userName || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email & Password are required" });
    }

    //Find user email & password before decrypting
    const user = await User.findOne({
      where: {
        email: userName,
        // password: password,
      },
    });

    //Check if user exists
    if (!user) {
      console.log(
        "User not found with provided credentials. If new user, complete registration!"
      );
      return res.status(404).json({
        success: false,
        error: "USER_NOT_FOUND",
        message: "No account found with this email address",
      });
    }

    //compare provided password with stored hash
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.passwordInput
    );
    if (!isValidPassword) {
      console.log("Entered password does not match");
      return res.status(401).json({
        success: false,
        error: "INVALID_PASSWORD",
        message: "Incorrect Password. Please enter correct password",
      });
    } else {
      console.log("User Found", {
        id: user.id,
        email: user.email,
      });
    }

    //successfull login - jwt token generate
    const tokenPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastname: user.lastName,
      role: "user",
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "24h" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login Failed!", error: error.message });
  }
});

export default router;
