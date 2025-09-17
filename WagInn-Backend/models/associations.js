import User from "./userRegistration_Model.js";
import Pet from "./petProfile_Model.js";

//Define relationships
User.hasMany(Pet, {
  foreignKey: "userId",
  as: "pets",
});

Pet.belongsTo(User, {
  foreignKey: "userId",
  as: "owner",
});

export { User, Pet };
