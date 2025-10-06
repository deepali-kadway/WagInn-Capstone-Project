import express from "express";
const router = express.Router();
import Host from "../models/hostRegistration_Model.js";

// Debug logs
router.use((req, res, next) => {
  console.log(`ADMIN: ${req.method} ${req.path} - Request Received`);
  next();
});

// Get all hosts with their approval status
router.get("/hosts", async (req, res) => {
  try {
    const hosts = await Host.findAll({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "registrationStatus",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      hosts: hosts,
      total: hosts.length,
    });
  } catch (error) {
    console.error("Error fetching hosts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hosts",
      error: error.message,
    });
  }
});

// Approve a host
router.put("/hosts/:hostId/approve", async (req, res) => {
  try {
    const { hostId } = req.params;

    const host = await Host.findByPk(hostId);
    if (!host) {
      return res.status(404).json({
        success: false,
        message: "Host not found",
      });
    }

    // Update approval status
    await host.update({ registrationStatus: "approved" });

    console.log(`Host ${hostId} approved successfully`);

    res.json({
      success: true,
      message: "Host approved successfully",
      host: {
        id: host.id,
        firstName: host.firstName,
        lastName: host.lastName,
        email: host.email,
        registrationStatus: host.registrationStatus,
      },
    });
  } catch (error) {
    console.error("Error approving host:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve host",
      error: error.message,
    });
  }
});

// Reject a host
router.put("/hosts/:hostId/reject", async (req, res) => {
  try {
    const { hostId } = req.params;

    const host = await Host.findByPk(hostId);
    if (!host) {
      return res.status(404).json({
        success: false,
        message: "Host not found",
      });
    }

    // Update approval status
    await host.update({ registrationStatus: "rejected" });

    console.log(`Host ${hostId} rejected`);

    res.json({
      success: true,
      message: "Host rejected",
      host: {
        id: host.id,
        firstName: host.firstName,
        lastName: host.lastName,
        email: host.email,
        registrationStatus: host.registrationStatus,
      },
    });
  } catch (error) {
    console.error("Error rejecting host:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject host",
      error: error.message,
    });
  }
});

export default router;
