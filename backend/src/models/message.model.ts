import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER
  },
  groupId: {
    type: DataTypes.INTEGER
  }
});