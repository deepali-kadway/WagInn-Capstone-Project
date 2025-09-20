import express from "express";
import Booking from "../models/bookings_Model.js";
import HostProfile from "../models/hostRegistration_Model.js";
import UserProfile from "../models/userRegistration_Model.js";

const router = express.Router();

// POST /api/bookings - Create a new booking
router.post("/", async (req, res) => {
  try {
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

export default router;
