import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
  
});
import { Group } from "./group.model";

User.belongsToMany(Group, { through: "UserGroups" });
Group.belongsToMany(User, { through: "UserGroups" });