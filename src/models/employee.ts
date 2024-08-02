"use strict";
import { Model, Optional, DataTypes } from "sequelize";
import sequelizeConnection from "../config/connection";

export interface EmployeeAttributes {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  contact: string;
  education: string;
  address?: string;
  position: string;
  salary: number;
  UserId: number;
  StoreId: number;
}

export interface EmployeeCreationAttributes
  extends Optional<EmployeeAttributes, "id"> {}

class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> implements EmployeeAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public dateOfBirth!: Date;
  public contact!: string;
  public education!: string;
  public address?: string;
  public position!: string;
  public salary!: number;
  public UserId!: number;
  public StoreId!: number;

  static associate(models: any) {
    // define association here
    Employee.hasMany(models.Payroll, {foreignKey: "EmployeeId"})
    Employee.hasMany(models.Attendance, {foreignKey: "EmployeeId"})

    Employee.belongsTo(models.User, {foreignKey: "UserId"})
    Employee.belongsTo(models.Store, {foreignKey: "StoreId"})
  }
}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "first name cannot to be null" },
        notEmpty: { msg: "first name is required" },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "last name cannot to be null" },
        notEmpty: { msg: "last name is required" },
      },
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: "date of birth cannot to be null" },
        notEmpty: { msg: "date of birth is required" },
      },
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "contact cannot to be null" },
        notEmpty: { msg: "contact is required" },
      },
    },
    education: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "education cannot to be null" },
        notEmpty: { msg: "education is required" },
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "position cannot to be null" },
        notEmpty: { msg: "position is required" },
      },
    },
    salary: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "salary cannot to be null" },
        notEmpty: { msg: "salary is required" },
      },
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "UserId cannot to be null" },
        notEmpty: { msg: "UserId is required" },
      },
      references: {
        model: "Users",
        key: "id",
      },
    },
    StoreId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "StoreId cannot to be null" },
        notEmpty: { msg: "StoreId is required" },
      },
      references: {
        model: "Stores",
        key: "id",
      },
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "Employee",
  }
);

export default Employee;
