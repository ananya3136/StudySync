import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const File = sequelize.define("File", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  filename: {
    type: DataTypes.STRING
  },
  path: {
    type: DataTypes.STRING
  },
  groupId: {
    type: DataTypes.INTEGER
  },
  userId: {
    type: DataTypes.INTEGER
  }
});