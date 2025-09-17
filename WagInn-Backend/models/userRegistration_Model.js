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
});

export default User;
