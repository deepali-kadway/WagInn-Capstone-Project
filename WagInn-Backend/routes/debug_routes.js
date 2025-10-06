import express from "express";
const router = express.Router();
import Host from "../models/hostRegistration_Model.js";
import { Op } from "sequelize";

// Debug logs
router.use((req, res, next) => {
  console.log(`DEBUG: ${req.method} ${req.path} - Request Received`);
  next();
});

// Get detailed host information for debugging
router.get("/hosts/:hostId/details", async (req, res) => {
  try {
    const { hostId } = req.params;

    const host = await Host.findByPk(hostId);
    if (!host) {
      return res.status(404).json({
        success: false,
        message: "Host not found",
      });
    }

    res.json({
      success: true,
      host: host.toJSON(), // Returns all fields
    });
  } catch (error) {
    console.error("Error fetching host details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch host details",
      error: error.message,
    });
  }
});

// Debug the search logic
router.get("/search-debug", async (req, res) => {
  try {
    console.log("DEBUG Search request received: ", req.query);

    const { destination, totalGuests, pets } = req.query;

    console.log("DEBUG Parsed parameters:", {
      destination,
      totalGuests: parseInt(totalGuests),
      pets: parseInt(pets),
    });

    // Build the same search criteria as the real search
    const whereClause = {
      [Op.or]: [
        { city: { [Op.like]: `%${destination.toLowerCase()}%` } },
        { province: { [Op.like]: `%${destination.toLowerCase()}%` } },
        { propertyTitle: { [Op.like]: `%${destination.toLowerCase()}%` } },
        { streetAddress: { [Op.like]: `%${destination.toLowerCase()}%` } },
        { country: { [Op.like]: `%${destination.toLowerCase()}%` } },
      ],
      guests: { [Op.gte]: parseInt(totalGuests) || 1 },
      pets: { [Op.gte]: parseInt(pets) || 0 },
      isActive: true,
      registrationStatus: "active",
    };

    console.log("DEBUG Search criteria:", JSON.stringify(whereClause, null, 2));

    // Search for host properties
    const hostProperties = await Host.findAll({
      where: whereClause,
      attributes: [
        "id",
        "firstName",
        "lastName",
        "city",
        "province",
        "guests",
        "pets",
        "isActive",
        "registrationStatus",
      ],
    });

    res.json({
      success: true,
      searchQuery: req.query,
      parsedParams: {
        destination,
        totalGuests: parseInt(totalGuests),
        pets: parseInt(pets),
      },
      searchCriteria: whereClause,
      foundProperties: hostProperties.length,
      properties: hostProperties,
    });
  } catch (error) {
    console.error("Error in debug search:", error);
    res.status(500).json({
      success: false,
      message: "Debug search failed",
      error: error.message,
    });
  }
});

export default router;
