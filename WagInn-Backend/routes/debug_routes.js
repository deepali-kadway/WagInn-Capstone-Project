import express from "express";
const router = express.Router();
import Host from "../models/hostRegistration_Model.js";

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

export default router;
