import express from "express";
const router = express.Router();
import { v4 as uuidv4 } from "uuid";
import User from "../models/userRegistration_Model.js";
import bcrypt from "bcrypt";

//debug logs
router.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Request Received`);
  next();
});

//Post User registration data
router.post("/register", async (req, res) => {
  try {
    // Basic debugging first
    console.log("=== DEBUGGING REQUEST ===");
    console.log("req.body exists:", req.body !== undefined);
    console.log("req.body type:", typeof req.body);
    console.log("req.body:", req.body);
    console.log("req.headers:", req.headers);
    console.log("========================");

    // Check if req.body exists before proceeding
    if (!req.body) {
      return res.status(400).json({
        message: "No request body received",
        error: "req.body is undefined - check middleware setup",
      });
    }

    console.log(`Step 1: Request Body: `, req.body);

    // Debug: Check raw data before parsing
    console.log("Step 1.5: Raw personalInfo:", req.body.personalInfo);
    console.log("Step 1.6: Raw userPetInfo:", req.body.userPetInfo);

    //JSON Parsing
    const parseJSONFields = (data) => {
      const fieldsToParse = ["personalInfo", "userPetInfo"];
      fieldsToParse.forEach((field) => {
        if (data[field] && typeof data[field] === "string") {
          try {
            data[field] = JSON.parse(data[field]);
          } catch (err) {
            console.error(`Error parsing ${field}: `, err);
          }
        }
      });
    };
    console.log("Step 2: Parsing JSON fields");
    parseJSONFields(req.body);

    // Debug: Check parsed data structure
    console.log(
      "Step 2.5: Parsed personalInfo:",
      JSON.stringify(req.body.personalInfo, null, 2)
    );
    console.log(
      "Step 2.6: Parsed userPetInfo:",
      JSON.stringify(req.body.userPetInfo, null, 2)
    );

    console.log("Step 3: Creating user data");
    // Hash password after parsing
    const hashedPassword = await bcrypt.hash(
      req.body.personalInfo?.passwordInput,
      10
    );

    const userData = {
      id: uuidv4(),
      ...req.body,
      personalInfo: {
        ...req.body.personalInfo,
        passwordInput: hashedPassword,
      },
    };

    const flattenUserData = (data) => {
      const flattened = {
        id: data.id,

        //extract from personalInfo
        firstName: data.personalInfo?.firstName,
        lastName: data.personalInfo?.lastName,
        birthMonth: data.personalInfo?.birthMonth,
        birthDay: data.personalInfo?.birthDay,
        birthYear: data.personalInfo?.birthYear,
        email: data.personalInfo?.email,
        phone: data.personalInfo?.phone,
        passwordInput: data.personalInfo?.passwordInput,

        //extract from petInfo (handle pets array - take first pet for now)
        petName: data.userPetInfo?.pets?.[0]?.petName,
        petType: data.userPetInfo?.pets?.[0]?.petType,
        breed: data.userPetInfo?.pets?.[0]?.breed,
        size: data.userPetInfo?.pets?.[0]?.size,
        age: data.userPetInfo?.pets?.[0]?.age,
        isVaccinated: data.userPetInfo?.pets?.[0]?.isVaccinated,
        vaccinations: data.userPetInfo?.pets?.[0]?.vaccinations || [],
        isNeutered: data.userPetInfo?.pets?.[0]?.isNeutered,
        isFleaTickPrevented: data.userPetInfo?.pets?.[0]?.isFleaTickPrevented,
        concerns: data.userPetInfo?.pets?.[0]?.concerns,
      };
      return flattened;
    };
    console.log("Step 4: Flatten nested data");
    const flattenedData = flattenUserData(userData);
    console.log(
      "Step 5: Final Flatten data:",
      JSON.stringify(flattenedData, null, 2)
    );
    //null -> include all properties, don't filer anything; 2 -> indentation in formated output. each nested level is indented by 2 spaces.

    console.log("Step 6: About to create database record");
    const newUser = await User.create(flattenedData);

    res
      .status(201)
      .json({ message: "User Registration Successfull", user: newUser });
  } catch (error) {
    console.error("Detailed error:", error);
    console.error("Request data:", req.body);
    res.status(500).json({
      message: "Host Registration FAILED",
      error: error.message,
    });
  }
});

export default router;
