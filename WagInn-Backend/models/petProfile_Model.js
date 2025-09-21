import sequelize from "../config.js";
import { DataTypes } from "sequelize";

const Pet = sequelize.define("Pet_Profile", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "user_profiles", //corrected to match actual table name
      key: "id",
    },
  },
  petName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  petType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isVaccinated: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vaccinations: {
    type: DataTypes.JSON,
  },
  isNeutered: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isFleaTickPrevented: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  concerns: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: "pet_profiles",
  timestamps: true,
});

export default Pet;
