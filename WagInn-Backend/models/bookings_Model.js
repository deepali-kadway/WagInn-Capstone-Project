import { DataTypes } from "sequelize";
import sequelize from "../config.js";

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "user_profiles",
        key: "id",
      },
    },
    property_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "host_profiles",
        key: "id",
      },
    },
    confirmation_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    property_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    property_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    host_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    check_in: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    check_out: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    total_nights: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    adults: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    children: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    infants: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    pets: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    price_per_night: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    booking_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "confirmed",
    },
  },
  {
    tableName: "bookings",
    timestamps: true,
    hooks: {
      beforeCreate: (booking) => {
        // Generate confirmation number if not provided
        if (!booking.confirmation_number) {
          const prefix = "WI";
          const timestamp = Date.now().toString().slice(-6);
          const random = Math.random().toString(36).substr(2, 4).toUpperCase();
          booking.confirmation_number = `${prefix}${timestamp}${random}`;
        }
      },
    },
  }
);

// Import other models for associations
import User from "./userRegistration_Model.js";
import Host from "./hostRegistration_Model.js";

// Define associations
Booking.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Booking.belongsTo(Host, {
  foreignKey: "property_id",
  as: "host",
});

// Reverse associations
User.hasMany(Booking, {
  foreignKey: "user_id",
  as: "bookings",
});

Host.hasMany(Booking, {
  foreignKey: "property_id",
  as: "bookings",
});

export default Booking;
