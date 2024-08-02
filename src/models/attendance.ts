"use strict";
// const { Model } = require("sequelize");
import { Model, Optional, DataTypes } from "sequelize";
import sequelizeConnection from "../config/connection";

type StatusType = "Present" | "Absent" | "Sick" | "Leave";

export interface AttendanceAttributes {
  id: number;
  date: Date;
  status: StatusType;
  EmployeeId: number;
}

export interface AttendanceCreationsAttributes
  extends Optional<AttendanceAttributes, "id"> {}

class Attendance
  extends Model<AttendanceAttributes, AttendanceCreationsAttributes>
  implements AttendanceAttributes
{
  public id!: number;
  public date!: Date;
  public status!: StatusType;
  public EmployeeId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // define association here
    Attendance.belongsTo(models.Employee, {foreignKey: "EmployeeId"})
  }
}
Attendance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: "Date of Attendance cannot be null" },
        notEmpty: { msg: "Date of Attendance is required" },
      },
    },
    status: {
      type: DataTypes.ENUM("Present", "Absent", "Sick", "Leave"),
      allowNull: false,
      validate: {
        notNull: { msg: "Date of Attendance cannot be null" },
        notEmpty: { msg: "Date of Attendance is required" },
        isIn: {
          args: [["Present", "Absent", "Sick", "Leave"]],
          msg: "Invalid Attendance Status",
        },
      },
      defaultValue: "Absent",
    },
    EmployeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Employee Id cannot be null" },
        notEmpty: { msg: "Employee Id is required" },
      },
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "Attendance",
  }
);

export default Attendance;
