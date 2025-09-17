import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import User from "../models/userRegistration_Model.js";

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
      console.log("User not found with provided credentials");
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
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
        message: "Invalid Password",
      });
    } else {
      console.log("User Found", {
        id: user.id,
        email: user.email,
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
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
