"use strict";

import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config/connection";

type StatusType = "PAID" | "UNPAID";

export interface PayrollAttributes {
  id: number;
  date: Date;
  amount: number;
  status: StatusType;
  EmployeeId: number;
}

export interface PayrollCreationsAttributes
  extends Optional<PayrollAttributes, "id"> {}

class Payroll
  extends Model<PayrollAttributes, PayrollCreationsAttributes>
  implements PayrollAttributes
{
  public id!: number;
  public date!: Date;
  public amount!: number;
  public status!: StatusType;
  public EmployeeId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // define association here
    Payroll.belongsTo(models.Employee,{ foreignKey: "EmployeeId"})
  }
}
Payroll.init(
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
        notNull: { msg: "Date of Payroll cannot be null" },
        notEmpty: { msg: "Date of Payroll is required" },
      },
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Amount cannot be null" },
        notEmpty: { msg: "Amount is required" },
      },
    },
    status: {
      type: DataTypes.ENUM("PAID", "UNPAID"),
      allowNull: false,
      validate: {
        notNull: { msg: "Status Payroll cannot be null" },
        notEmpty: { msg: "Status Payroll is required" },
        isIn: {
          args: [["PAID", "UNPAID"]],
          msg: "Invalid Payroll Status",
        },
      },
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
    modelName: "Payroll",
  }
);

export default Payroll;
