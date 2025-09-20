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
        "email",
        "city",
        "province",
        "country",
        "streetAddress",
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
        "basePrice",
        "totalGuestPrice",
        "propertyPhotos",
      ],
      order: [["totalGuestPrice", "ASC"]],
    });
    console.log(`Found ${hostProperties.length} matching properties`);

    res.status(200).json({
      success: true,
      message: `Found ${hostProperties.length} properties`,
      properties: hostProperties,
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

export default router;
