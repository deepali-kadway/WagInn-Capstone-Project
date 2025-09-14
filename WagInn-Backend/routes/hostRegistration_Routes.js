import express from "express";
const router = express.Router();
import { v4 as uuidv4 } from "uuid";
import Host from "../models/hostRegistration_Model.js";
import upload, {
  addFileMetadata,
  getSafeFileUrl,
  getDecodedFilePath,
} from "../middleware/upload.js";
import multer from "multer";
import path from "path";
import fs from "fs";

//debug logs
router.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Request Received`);
  next();
});

// Error handling middleware for file upload errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Maximum size is 5MB." });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res
        .status(400)
        .json({ error: "Too many files. Maximum 10 files allowed." });
    }
  }
  if (error.message && error.message.includes("Invalid file type")) {
    return res.status(400).json({ error: error.message });
  }
  next(error);
});

const flexibleUpload = upload.any(); //accepts any field names
//Post Host registration data
router.post("/register", flexibleUpload, addFileMetadata, async (req, res) => {
  try {
    console.log(`Step 1: Request Body: `, req.body);
    console.log(`Step 2: Uploaded Files: `, req.files);

    // Process files dynamically with enhanced security metadata
    const processSecureFiles = () => {
      const propertyPhotos = [];
      let frontIdUrl = null;
      let backIdUrl = null;

      if (req.files) {
        req.files.forEach((file) => {
          // Create secure file metadata object
          const fileMetadata = {
            originalName: file.safeOriginalName || file.originalname, // Decoded original name for display
            secureFilename: file.secureFilename || file.filename, // Secure filename on disk
            filePath: file.path, // File system path
            urlSafePath: file.urlSafePath || file.path, // URL-safe path for serving
            size: file.size,
            mimetype: file.mimetype,
            uploadTimestamp: new Date().toISOString(),
          };

          if (file.fieldname.startsWith("propertyPhoto")) {
            propertyPhotos.push(fileMetadata); // Store secure metadata instead of just path
          } else if (file.fieldname === "frontId") {
            frontIdUrl = fileMetadata; // Store secure metadata instead of just path
          } else if (file.fieldname === "backId") {
            backIdUrl = fileMetadata; // Store secure metadata instead of just path
          }
        });
      }

      return { propertyPhotos, frontIdUrl, backIdUrl };
    };

    const { propertyPhotos, frontIdUrl, backIdUrl } = processSecureFiles();

    // JSON Parsing
    const parseJSONFields = (data) => {
      const fieldsToParse = [
        "personalInfo",
        "addressDetails",
        "propertyDetails",
        "petInfo",
        "pricing",
        "idVerification",
      ];

      fieldsToParse.forEach((field) => {
        if (data[field] && typeof data[field] === "string") {
          try {
            data[field] = JSON.parse(data[field]);
          } catch (error) {
            console.error(`Error parsing ${field}:`, error);
          }
        }
      });
    };
    console.log("Step 3: Parsing JSON fields");
    parseJSONFields(req.body);

    console.log("Step 4: Creating host data");
    const hostData = {
      id: uuidv4(),
      ...req.body,
      propertyPhotos: propertyPhotos, // Sequelize will handle JSON conversion automatically
      frontIdUrl: frontIdUrl || null, // Store as JSON object directly
      backIdUrl: backIdUrl || null, // Store as JSON object directly
    };

    const flattenHostData = (data) => {
      const flattened = {
        id: data.id,

        // Extract from personalInfo
        firstName: data.personalInfo?.firstName,
        lastName: data.personalInfo?.lastName,
        birthMonth: data.personalInfo?.birthMonth,
        birthDay: data.personalInfo?.birthDay,
        birthYear: data.personalInfo?.birthYear,
        email: data.personalInfo?.email,

        // Extract from addressDetails
        streetAddress: data.addressDetails?.streetAddress,
        city: data.addressDetails?.city,
        province: data.addressDetails?.province,
        zipCode: data.addressDetails?.zipCode,
        country: data.addressDetails?.country,

        // Extract from propertyDetails
        propertyTitle: data.propertyDetails?.propertyTitle,
        propertyType: data.propertyDetails?.propertyType,
        ammenities: data.propertyDetails?.ammenities,
        guests: data.propertyDetails?.guests,
        bedrooms: data.propertyDetails?.bedrooms,
        beds: data.propertyDetails?.beds,
        bathrooms: data.propertyDetails?.bathrooms,
        pets: data.propertyDetails?.pets,
        ammenitiesPets: data.propertyDetails?.ammenitiesPets,

        // Extract from petInfo
        allowedPetsType: data.petInfo?.allowedPetsType || [], // Sequelize handles JSON automatically
        petSizeRestrictions: data.petInfo?.petSizeRestrictions || {}, // Sequelize handles JSON automatically
        houseRules: data.petInfo?.houseRules,
        requiredVaccinations: data.petInfo?.requiredVaccinations || [], // Sequelize handles JSON automatically
        neuteredSpayedRequired: data.petInfo?.neuteredSpayedRequired,
        fleaTickPreventionRequired: data.petInfo?.fleaTickPreventionRequired,

        // Extract from pricing (use frontend calculated values)
        basePrice: data.pricing?.basePrice,
        totalGuestPrice: data.pricing?.totalGuestPrice,
        hostEarnings: data.pricing?.hostEarnings,

        // File fields
        propertyPhotos: data.propertyPhotos,
        frontIdUrl: data.frontIdUrl,
        backIdUrl: data.backIdUrl,
      };

      return flattened;
    };
    console.log("Step 5: Flattening nested data");
    const flattenedData = flattenHostData(hostData);
    console.log(
      "Step 6: Final flattened data:",
      JSON.stringify(flattenedData, null, 2) //null -> include all properties, don't filer anything; 2 -> indentation in formated output. each nested level is indented by 2 spaces.
    );

    console.log("Step 7: About to create database record");
    const newHost = await Host.create(flattenedData);

    res
      .status(201)
      .json({ message: "Host Registration Successful", host: newHost });
  } catch (error) {
    console.error("Detailed error:", error);
    console.error("Request data:", req.body);
    res.status(500).json({
      message: "Host Registration FAILED",
      error: error.message,
    });
  }
});

// Secure file serving route
router.get("/files/:folder/:filename", (req, res) => {
  try {
    const folder = req.params.folder;
    const encodedFilename = req.params.filename;

    // Validate folder to prevent directory traversal
    const allowedFolders = ["property-photos", "id-verification"];
    if (!allowedFolders.includes(folder)) {
      return res.status(400).json({ error: "Invalid folder" });
    }

    // Decode filename safely
    const decodedFilename = getDecodedFilePath(encodedFilename);
    const filePath = path.join("uploads", folder, decodedFilename);

    // Check if file exists and serve it
    if (fs.existsSync(filePath)) {
      res.sendFile(path.resolve(filePath));
    } else {
      res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    console.error("Error serving file:", error);
    res.status(500).json({ error: "Error serving file" });
  }
});

export default router;
