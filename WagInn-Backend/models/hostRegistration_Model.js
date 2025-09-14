import sequelize from "../config.js";
import { DataTypes } from "sequelize";

const Host = sequelize.define("Host_Profile", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, //Generates uuid automatically
    primaryKey: true,
  },
  //personal info
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthMonth: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthDay: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  birthYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },

  // Address Info
  streetAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  province: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  //Pet Info
  allowedPetsType: {
    type: DataTypes.JSON, // Changed to JSON for array data
    allowNull: false,
  },
  petSizeRestrictions: {
    type: DataTypes.JSON, // Changed to JSON for object data
    allowNull: false,
  },
  houseRules: {
    type: DataTypes.TEXT,
  },
  requiredVaccinations: {
    type: DataTypes.JSON, // Changed to JSON for array data
  },
  neuteredSpayedRequired: {
    type: DataTypes.STRING,
  },
  fleaTickPreventionRequired: {
    type: DataTypes.STRING,
  },

  //property info
  propertyTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  propertyType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ammenities: {
    type: DataTypes.TEXT,
  },
  guests: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bedrooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  beds: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bathrooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pets: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ammenitiesPets: {
    type: DataTypes.TEXT,
  },
  propertyPhotos: {
    type: DataTypes.JSON,
    defaultValue: [],
  },

  //Pricing
  basePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  totalGuestPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  hostEarnings: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  // ID Verification
  frontIdUrl: {
    type: DataTypes.JSON, // Use JSON for structured metadata
  },
  backIdUrl: {
    type: DataTypes.JSON, // Use JSON for structured metadata
  },

  // Overall Status
  registrationStatus: {
    type: DataTypes.ENUM("pending", "active", "suspended", "rejected"),
    defaultValue: "pending",
  },
  registrationCompletedAt: {
    type: DataTypes.DATE,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

export default Host;
