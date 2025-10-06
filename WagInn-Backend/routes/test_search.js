import express from "express";
const router = express.Router();
import Host from "../models/hostRegistration_Model.js";
import { Op } from "sequelize";

// Simple test endpoint to find Jake specifically
router.get("/find-jake", async (req, res) => {
  try {
    // Find Jake by city = Banff
    const jakeByCity = await Host.findAll({
      where: {
        city: "Banff",
      },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "city",
        "isActive",
        "registrationStatus",
      ],
    });

    // Find Jake by city LIKE banff (case insensitive)
    const jakeByCityLike = await Host.findAll({
      where: {
        city: { [Op.like]: "%banff%" },
      },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "city",
        "isActive",
        "registrationStatus",
      ],
    });

    // Find Jake by all active criteria
    const jakeActive = await Host.findAll({
      where: {
        isActive: true,
        registrationStatus: "active",
      },
      attributes: [
        "id",
        "firstName",
        "lastName",
        "city",
        "isActive",
        "registrationStatus",
      ],
    });

    res.json({
      success: true,
      exactCity: jakeByCity.length,
      exactCityData: jakeByCity,
      likeCity: jakeByCityLike.length,
      likeCityData: jakeByCityLike,
      activeHosts: jakeActive.length,
      activeHostsData: jakeActive,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
