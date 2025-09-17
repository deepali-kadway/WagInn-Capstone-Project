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
    console.log(`Step 1: Request Body: `, req.body);

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

    console.log("Step 3: Creating user data");
    const userData = {
      id: uuidv4(),
      ...req.body,
      passwordInput: await bcrypt.hash(passwordInput, 10),
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

        //extract from petInfo
        petName: data.userPetInfo?.petName,
        petType: data.userPetInfo?.petType,
        breed: data.userPetInfo?.breed,
        size: data.userPetInfo?.size,
        age: data.userPetInfo?.age,
        isVaccinated: data.userPetInfo?.isVaccinated,
        vaccinations: data.userPetInfo?.vaccinations || [],
        isNeutered: data.userPetInfo?.isNeutered,
        isFleaTickPrevented: data.userPetInfo?.isFleaTickPrevented,
        concerns: data.userPetInfo?.concerns,
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
