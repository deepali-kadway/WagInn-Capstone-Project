import express from "express";
const router = express.Router();
import { v4 as uuidv4 } from "uuid";
import Host from "../models/hostRegistration_Model.js";
import upload from "../middleware/upload.js";

//debug logs
router.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Request Received`);
  next();
});

const flexibleUpload = upload.any(); //accepts any field names
//Post Host registration data
router.post("/register", flexibleUpload, async (req, res) => {
  try {
    console.log(`Step 1: Request Body: `, req.body);
    console.log(`Step 2: Uploaded Files: `, req.files);

    // Process files dynamically
    const propertyPhotos = [];
    let frontIdUrl = null;
    let backIdUrl = null;

    if (req.files) {
      req.files.forEach((file) => {
        if (file.fieldname.startsWith("propertyPhoto")) {
          propertyPhotos.push(file.path);
        } else if (file.fieldname === "frontId") {
          frontIdUrl = file.path;
        } else if (file.fieldname === "backId") {
          backIdUrl = file.path;
        }
      });
    }

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
      propertyPhotos: JSON.stringify(propertyPhotos),
      frontIdUrl,
      backIdUrl,
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
        allowedPetsType: JSON.stringify(data.petInfo?.allowedPetsType || []),
        petSizeRestrictions: JSON.stringify(
          data.petInfo?.petSizeRestrictions || {}
        ),
        houseRules: data.petInfo?.houseRules,
        requiredVaccinations: JSON.stringify(
          data.petInfo?.requiredVaccinations || []
        ),
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

export default router;
