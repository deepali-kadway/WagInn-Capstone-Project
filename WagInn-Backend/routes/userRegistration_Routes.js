import express from "express";
const router = express.Router();
import { v4 as uuidv4 } from "uuid";
import { User, Pet } from "../models/associations.js";
import bcrypt from "bcrypt";
import sequelize from "../config.js";

//debug logs
router.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Request Received`);
  next();
});

//Post User registration data
router.post("/register", async (req, res) => {
  //start a database transaction
  const transaction = await sequelize.transaction();

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
    console.log("Step 1.1: Raw personalInfo:", req.body.personalInfo);
    console.log("Step 1.2: Raw userPetInfo:", req.body.userPetInfo);

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
      "Step 2.1: Parsed personalInfo:",
      JSON.stringify(req.body.personalInfo, null, 2)
    );
    console.log(
      "Step 2.2: Parsed userPetInfo:",
      JSON.stringify(req.body.userPetInfo, null, 2)
    );

    //extract user data and pets data
    const personalInfo = req.body.personalInfo;
    const petsData = req.body.userPetInfo?.pets || [];

    console.log("Step 3: Creating user data");
    // Hash password after parsing
    const hashedPassword = await bcrypt.hash(
      req.body.personalInfo?.passwordInput,
      10
    );

    // Prepare user data (personal info only)
    const userData = {
      // No manually setting id - the model will generate it with UUIDV4
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      birthMonth: personalInfo.birthMonth,
      birthDay: personalInfo.birthDay,
      birthYear: personalInfo.birthYear,
      email: personalInfo.email,
      phone: personalInfo.phone,
      passwordInput: hashedPassword,
    };

    console.log("Step 4: Creating user record for personal data");
    console.log("User data: ", JSON.stringify(userData, null, 2));

    //create user record
    const newUser = await User.create(userData, { transaction });

    console.log("Step 4.1: User created successfully");
    console.log("New user ID:", newUser.id);
    console.log("New user object:", JSON.stringify(newUser.toJSON(), null, 2));

    console.log("Step 5: Creating pet records");
    console.log("Pets data:", JSON.stringify(petsData, null, 2));

    // Create pet records associated with the user
    if (petsData.length > 0) {
      const petPromises = petsData.map((petData) => {
        return Pet.create(
          {
            //removing manual UUID. sequelize model is generating UUID automatically
            userId: newUser.id, // Use newUser.id instead of newUser.userId
            petName: petData.petName,
            petType: petData.petType,
            breed: petData.breed,
            size: petData.size,
            age: petData.age,
            isVaccinated: petData.isVaccinated,
            vaccinations: petData.vaccinations || [],
            isNeutered: petData.isNeutered,
            isFleaTickPrevented: petData.isFleaTickPrevented,
            concerns: petData.concerns,
          },
          { transaction }
        );
      });

      await Promise.all(petPromises);
      console.log(`Step 6: Created ${petsData.length} pet records`);
    }

    // Commit transaction
    await transaction.commit();

    res.status(201).json({
      message: "User and pets registered successfully",
      userId: newUser.id, // Use newUser.id instead of newUser.userId
      petsCreated: petsData.length,
    });
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    console.error("Detailed error:", error);
    console.error("Request data:", req.body);
    res.status(500).json({
      message: "Host Registration FAILED",
      error: error.message,
    });
  }
});

export default router;
