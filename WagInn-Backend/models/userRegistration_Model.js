import sequelize from "../config.js";
import { DataTypes } from "sequelize";

const User = sequelize.define("User_Profile", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, //generates automatically
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
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  passwordInput: {
    type: DataTypes.STRING(255), // for bcrypt storage
    allowNull: false,
  },

  //Pet Info
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
});

export default User;
