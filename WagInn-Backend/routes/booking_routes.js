import express from "express";
import Booking from "../models/bookings_Model.js";
import HostProfile from "../models/hostRegistration_Model.js";
import UserProfile from "../models/userRegistration_Model.js";
import Pet from "../models/petProfile_Model.js";
import "../models/associations.js"; // Import associations

const router = express.Router();

// DEBUG: Get all users to see what IDs exist
router.get("/debug/users", async (req, res) => {
  try {
    const users = await UserProfile.findAll({
      attributes: ["id", "firstName", "lastName", "email"],
    });
    res.json({
      success: true,
      count: users.length,
      users: users.map((u) => u.toJSON()),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DEBUG: Check table information
router.get("/debug/tables", async (req, res) => {
  try {
    const queryInterface = UserProfile.sequelize.getQueryInterface();
    const tableNames = await queryInterface.showAllTables();

    // Get specific table descriptions
    const userTableDesc = await queryInterface.describeTable("User_Profiles");
    const hostTableDesc = await queryInterface.describeTable("Host_Profiles");
    const bookingTableDesc = await queryInterface.describeTable("bookings");

    res.json({
      success: true,
      allTables: tableNames,
      userTable: userTableDesc,
      hostTable: hostTableDesc,
      bookingTable: bookingTableDesc,
    });
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// POST /api/bookings - Create a new booking
router.post("/", async (req, res) => {
  try {
    // Debug: Log what we're receiving
    console.log("📝 Booking request received:");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("Query:", req.query);

    const {
      user_id,
      property_id,
      confirmation_number,
      property_title,
      property_type,
      host_name,
      location,
      check_in,
      check_out,
      total_nights,
      adults,
      children = 0,
      infants = 0,
      pets = 0,
      total_price,
      price_per_night,
    } = req.body;

    // Validate required fields
    if (!user_id || !property_id || !check_in || !check_out || !total_price) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: user_id, property_id, check_in, check_out, total_price",
      });
    }

    // Validate dates
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const today = new Date();

    if (checkInDate < today) {
      return res.status(400).json({
        success: false,
        message: "Check-in date cannot be in the past",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    // Validate user exists
    const user = await UserProfile.findByPk(user_id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: `User with ID ${user_id} does not exist`,
      });
    }

    // Validate host/property exists
    const host = await HostProfile.findByPk(property_id);
    if (!host) {
      return res.status(400).json({
        success: false,
        message: `Property with ID ${property_id} does not exist`,
      });
    }

    // Create the booking
    const booking = await Booking.create({
      user_id,
      property_id,
      confirmation_number,
      property_title,
      property_type,
      host_name,
      location,
      check_in,
      check_out,
      total_nights,
      adults,
      children,
      infants,
      pets,
      total_price,
      price_per_night,
      status: "confirmed",
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: {
        id: booking.id,
        confirmation_number: booking.confirmation_number,
        property_title: booking.property_title,
        property_type: booking.property_type,
        host_name: booking.host_name,
        location: booking.location,
        check_in: booking.check_in,
        check_out: booking.check_out,
        total_nights: booking.total_nights,
        adults: booking.adults,
        children: booking.children,
        infants: booking.infants,
        pets: booking.pets,
        total_price: booking.total_price,
        price_per_night: booking.price_per_night,
        booking_date: booking.booking_date,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
});

// GET /api/bookings/user/:userId - Get all bookings for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, limit = 50, offset = 0 } = req.query;

    // Build where clause
    const whereClause = { user_id: userId };
    if (status) {
      whereClause.status = status;
    }

    const bookings = await Booking.findAll({
      where: whereClause,
      order: [["booking_date", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      // Temporarily removed includes to test if associations are causing errors
      // include: [
      //   {
      //     model: UserProfile,
      //     as: "user",
      //     attributes: ["id", "firstName", "lastName", "email"],
      //   },
      //   {
      //     model: HostProfile,
      //     as: "host",
      //     attributes: [
      //       "id",
      //       "firstName",
      //       "lastName",
      //       "email",
      //       "propertyTitle",
      //       "propertyType",
      //       "location",
      //     ],
      //   },
      // ],
      attributes: [
        "id",
        "confirmation_number",
        "property_title",
        "property_type",
        "host_name",
        "location",
        "check_in",
        "check_out",
        "total_nights",
        "adults",
        "children",
        "infants",
        "pets",
        "total_price",
        "price_per_night",
        "booking_date",
        "status",
      ],
    });

    // Add computed fields
    const enrichedBookings = bookings.map((booking) => {
      const bookingData = booking.toJSON();
      return {
        ...bookingData,
        total_guests:
          bookingData.adults + bookingData.children + bookingData.infants,
        booking_status: getBookingStatus(bookingData),
      };
    });

    res.json({
      success: true,
      bookings: enrichedBookings,
      total: enrichedBookings.length,
      message:
        enrichedBookings.length > 0
          ? "Bookings retrieved successfully"
          : "No bookings found",
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
});

// GET /api/bookings/host/:hostId - Get all bookings for a specific host
router.get("/host/:hostId", async (req, res) => {
  try {
    const { hostId } = req.params;
    const { status, limit = 50, offset = 0 } = req.query;

    // Build where clause
    const whereClause = { property_id: hostId };
    if (status) {
      whereClause.status = status;
    }

    const bookings = await Booking.findAll({
      where: whereClause,
      order: [["booking_date", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: UserProfile,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "phone"],
          include: [
            {
              model: Pet,
              as: "pets",
              attributes: ["id", "petName", "petType", "breed", "size", "age"],
            },
          ],
        },
      ],
      attributes: [
        "id",
        "confirmation_number",
        "property_title",
        "property_type",
        "host_name",
        "location",
        "check_in",
        "check_out",
        "total_nights",
        "adults",
        "children",
        "infants",
        "pets",
        "total_price",
        "price_per_night",
        "booking_date",
        "status",
      ],
    });

    // Add computed fields
    const enrichedBookings = bookings.map((booking) => {
      const bookingData = booking.toJSON();
      return {
        ...bookingData,
        total_guests:
          bookingData.adults + bookingData.children + bookingData.infants,
        booking_status: getBookingStatus(bookingData),
      };
    });

    res.json({
      success: true,
      bookings: enrichedBookings,
      total: enrichedBookings.length,
      message:
        enrichedBookings.length > 0
          ? "Host bookings retrieved successfully"
          : "No bookings found for this host",
    });
  } catch (error) {
    console.error("Error fetching host bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch host bookings",
      error: error.message,
    });
  }
});

// GET /api/bookings/confirmation/:confirmationNumber - Get booking by confirmation number
router.get("/confirmation/:confirmationNumber", async (req, res) => {
  try {
    const { confirmationNumber } = req.params;

    const booking = await Booking.findOne({
      where: { confirmation_number: confirmationNumber },
      // Temporarily removed includes to test if associations are causing the error
      // include: [
      //   {
      //     model: UserProfile,
      //     as: "user",
      //     attributes: ["id", "firstName", "lastName", "email"],
      //   },
      //   {
      //     model: HostProfile,
      //     as: "host",
      //     attributes: [
      //       "id",
      //       "firstName",
      //       "lastName",
      //       "email",
      //       "propertyTitle",
      //       "propertyType",
      //       "location",
      //     ],
      //   },
      // ],
      attributes: [
        "id",
        "confirmation_number",
        "property_title",
        "property_type",
        "host_name",
        "location",
        "check_in",
        "check_out",
        "total_nights",
        "adults",
        "children",
        "infants",
        "pets",
        "total_price",
        "price_per_night",
        "booking_date",
        "status",
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found with the provided confirmation number",
      });
    }

    const bookingData = booking.toJSON();
    const enrichedBooking = {
      ...bookingData,
      total_guests:
        bookingData.adults + bookingData.children + bookingData.infants,
      booking_status: getBookingStatus(bookingData),
    };

    res.json({
      success: true,
      booking: enrichedBooking,
      message: "Booking retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching booking by confirmation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
});

// GET /api/bookings/:bookingId - Get single booking details
router.get("/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByPk(bookingId, {
      attributes: [
        "id",
        "user_id",
        "property_id",
        "confirmation_number",
        "property_title",
        "property_type",
        "host_name",
        "location",
        "check_in",
        "check_out",
        "total_nights",
        "adults",
        "children",
        "infants",
        "pets",
        "total_price",
        "price_per_night",
        "booking_date",
        "status",
      ],
      include: [
        {
          model: UserProfile,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "phone"],
          include: [
            {
              model: Pet,
              as: "pets",
              attributes: [
                "id",
                "petName",
                "petType",
                "breed",
                "size",
                "age",
                "isVaccinated",
                "vaccinations",
                "isNeutered",
                "isFleaTickPrevented",
                "concerns",
              ],
            },
          ],
        },
        {
          model: HostProfile,
          as: "host",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "propertyTitle",
            "propertyType",
            "city",
            "province",
            "country",
          ],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const bookingData = booking.toJSON();
    const enrichedBooking = {
      ...bookingData,
      total_guests:
        bookingData.adults + bookingData.children + bookingData.infants,
      booking_status: getBookingStatus(bookingData),
    };

    res.json({
      success: true,
      booking: enrichedBooking,
      message: "Booking details retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking details",
      error: error.message,
    });
  }
});

// GET /api/bookings/user/:userId/upcoming - Get upcoming bookings for a user
router.get("/user/:userId/upcoming", async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date().toISOString().split("T")[0];

    const upcomingBookings = await Booking.findAll({
      where: {
        user_id: userId,
        check_in: {
          [Booking.sequelize.Sequelize.Op.gte]: today,
        },
        status: "confirmed",
      },
      order: [["check_in", "ASC"]],
      attributes: [
        "id",
        "confirmation_number",
        "property_title",
        "property_type",
        "host_name",
        "location",
        "check_in",
        "check_out",
        "total_nights",
        "adults",
        "children",
        "infants",
        "pets",
        "total_price",
        "status",
      ],
    });

    res.json({
      success: true,
      bookings: upcomingBookings,
      total: upcomingBookings.length,
      message:
        upcomingBookings.length > 0
          ? "Upcoming bookings retrieved successfully"
          : "No upcoming bookings found",
    });
  } catch (error) {
    console.error("Error fetching upcoming bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming bookings",
      error: error.message,
    });
  }
});

// Helper function to determine booking status
function getBookingStatus(booking) {
  const now = new Date();
  const checkIn = new Date(booking.check_in);
  const checkOut = new Date(booking.check_out);

  if (booking.status === "cancelled") return "cancelled";
  if (now < checkIn) return "upcoming";
  if (now >= checkIn && now <= checkOut) return "current";
  if (now > checkOut) return "completed";

  return booking.status;
}

// PUT /api/bookings/:bookingId/status - Update booking status
router.put("/:bookingId/status", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["confirmed", "cancelled", "completed", "pending"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: " + validStatuses.join(", "),
      });
    }

    // Find and update the booking
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Update the booking status
    await booking.update({ status });

    // Fetch the updated booking with user details
    const updatedBooking = await Booking.findByPk(bookingId, {
      include: [
        {
          model: UserProfile,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "phone"],
          include: [
            {
              model: Pet,
              as: "pets",
              attributes: ["id", "petName", "petType", "breed", "size", "age"],
            },
          ],
        },
      ],
    });

    res.json({
      success: true,
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message,
    });
  }
});

export default router;
