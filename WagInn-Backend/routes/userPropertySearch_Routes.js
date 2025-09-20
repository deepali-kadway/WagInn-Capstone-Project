import express from "express";
const router = express.Router();
import Host from "../models/hostRegistration_Model.js";
import { Op } from "sequelize";

router.get("/properties", async (req, res) => {
  try {
    console.log("Search request received: ", req.query);

    const { destination, totalGuests, pets } = req.query;

    console.log("Parsed parameters:", {
      destination,
      totalGuests: parseInt(totalGuests),
      pets: parseInt(pets),
    });

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: "Destination is required",
      });
    }

    //search criteria
    const whereClause = {
      //search by location (case-insensitive)
      [Op.or]: [
        { city: { [Op.like]: `%${destination.toLowerCase()}%` } },
        { province: { [Op.like]: `%${destination.toLowerCase()}%` } },
        { propertyTitle: { [Op.like]: `%${destination.toLowerCase()}%` } },
        { streetAddress: { [Op.like]: `%${destination.toLowerCase()}%` } },
        { country: { [Op.like]: `%${destination.toLowerCase()}%` } },
      ],
      //match guests capacity
      guests: { [Op.gte]: parseInt(totalGuests) || 1 },
      // match pets capacity
      pets: { [Op.gte]: parseInt(pets) || 0 },
      //only active hosts will be allowed
      isActive: true,
      registrationStatus: "active",
    };

    console.log("Search criteria:", whereClause);

    // search for host profiles
    const hostProperties = await Host.findAll({
      where: whereClause,
      attributes: [
        "id",
        "firstName",
        "lastName",
        "city",
        "province",
        "country",
        "zipCode",
        "propertyTitle",
        "propertyType",
        "ammenities",
        "guests",
        "bedrooms",
        "beds",
        "bathrooms",
        "pets",
        "ammenitiesPets",
        "allowedPetsType",
        "petSizeRestrictions",
        "houseRules",
        "requiredVaccinations",
        "totalGuestPrice",
        "propertyPhotos",
      ],
      order: [["totalGuestPrice", "ASC"]],
    });
    console.log(`Found ${hostProperties.length} matching properties`);

    // Process property photos for all properties
    const processedProperties = hostProperties.map((property) => {
      const propertyData = property.toJSON();

      // Handle propertyPhotos field
      if (propertyData.propertyPhotos) {
        try {
          let photos = propertyData.propertyPhotos;

          // If it's a string, try to parse it
          if (typeof photos === "string") {
            photos = JSON.parse(photos);
          }

          // If it's an array of objects with secureFilename, extract filenames
          if (Array.isArray(photos)) {
            propertyData.propertyPhotos = photos
              .map((photo) => {
                // If photo is an object with secureFilename, extract it
                if (typeof photo === "object" && photo.secureFilename) {
                  return photo.secureFilename;
                }
                // If photo is already a string (filename), use it directly
                return photo;
              })
              .filter((filename) => filename && typeof filename === "string");

            console.log(
              `Property ${propertyData.id} photos:`,
              propertyData.propertyPhotos
            );
          } else {
            propertyData.propertyPhotos = [];
          }
        } catch (error) {
          console.error(
            "Error processing property photos for property",
            propertyData.id,
            ":",
            error
          );
          propertyData.propertyPhotos = [];
        }
      } else {
        propertyData.propertyPhotos = [];
      }

      return propertyData;
    });

    res.status(200).json({
      success: true,
      message: `Found ${hostProperties.length} properties`,
      properties: processedProperties,
      searchCriteria: {
        destination,
        totalGuests: parseInt(totalGuests) || 1,
        pets: parseInt(pets) || 1,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
});

// return single property details
router.get("/properties/:id", async (req, res) => {
  try {
    const propertyId = req.params.id;
    console.log("Property details request for ID:", propertyId);

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        message: "Property ID is required",
      });
    }

    // Find the specific property by ID
    const property = await Host.findOne({
      where: {
        id: propertyId,
        isActive: true,
        registrationStatus: "active",
      },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "city",
        "province",
        "country",
        "zipCode",
        "propertyTitle",
        "propertyType",
        "ammenities",
        "guests",
        "bedrooms",
        "beds",
        "bathrooms",
        "pets",
        "ammenitiesPets",
        "allowedPetsType",
        "petSizeRestrictions",
        "houseRules",
        "requiredVaccinations",
        "totalGuestPrice",
        "propertyPhotos",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found or not available",
      });
    }

    console.log("Property found:", property.propertyTitle);

    // Process property photos to ensure proper format
    let processedProperty = property.toJSON();

    // Handle propertyPhotos field
    if (processedProperty.propertyPhotos) {
      try {
        let photos = processedProperty.propertyPhotos;

        // If it's a string, try to parse it
        if (typeof photos === "string") {
          photos = JSON.parse(photos);
        }

        // If it's an array of objects with secureFilename, extract filenames
        if (Array.isArray(photos)) {
          processedProperty.propertyPhotos = photos
            .map((photo) => {
              // If photo is an object with secureFilename, extract it
              if (typeof photo === "object" && photo.secureFilename) {
                return photo.secureFilename;
              }
              // If photo is already a string (filename), use it directly
              return photo;
            })
            .filter((filename) => filename && typeof filename === "string");
        } else {
          processedProperty.propertyPhotos = [];
        }
      } catch (error) {
        console.error("Error processing property photos:", error);
        processedProperty.propertyPhotos = [];
      }
    } else {
      processedProperty.propertyPhotos = [];
    }

    console.log("Processed property photos:", processedProperty.propertyPhotos);

    res.status(200).json({
      success: true,
      message: "Property details retrieved successfully",
      data: processedProperty,
    });
  } catch (error) {
    console.error("Error fetching property details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve property details",
      error: error.message,
    });
  }
});

export default router;
