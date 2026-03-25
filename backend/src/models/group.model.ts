import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const Group = sequelize.define("Group", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  }
});