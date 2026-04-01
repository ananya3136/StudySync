import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { User } from "./user.model";

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
  },
  userName: {
    type: DataTypes.STRING
  }
});

// Association: each Message belongs to a User
Message.belongsTo(User, { foreignKey: 'userId' });