import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  "studysync",   
  "root",        
  "1234",   
  {
    host: "localhost",
    dialect: "mysql",
  }
);