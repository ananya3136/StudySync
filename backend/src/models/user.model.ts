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
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Moderator', 'Student'),
    allowNull: false,
    defaultValue: 'Student'
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: true
  }
});
import { Group } from "./group.model";

User.belongsToMany(Group, { through: "UserGroups" });
Group.belongsToMany(User, { through: "UserGroups" });