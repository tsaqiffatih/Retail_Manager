"use strict";
import { Model, Optional, DataTypes } from "sequelize";
import sequelizeConnection from "../config/connection";
import Employee from "./employee";

export type UserRole =  "ADMIN" | "OWNER" | "EMPLOYEE" | "MANAGER" | "SUPER ADMIN";

export interface UserAttributes {
  id: number;
  userName: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export interface UserWithEmployee extends User {
  Employee?: Employee;
}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public userName!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // define association here
    User.hasMany(models.Store,{foreignKey: "OwnerId"})
    User.hasOne(models.Employee, {foreignKey: "UserId"})
    User.hasMany(models.AuditLog, {foreignKey: "UserId"})
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "userName cannot be null" },
        notEmpty: { msg: "userName is required" },
      },
      unique: {
        name: "Unique_Name_Constraint",
        msg: "userName has been already exists",
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "email cannot be null" },
        notEmpty: { msg: "email is required" },
        isEmail: { msg: "Invalid Email Type" },
      },
      unique: {
        name: "Unique_Name_Constraint",
        msg: "email has been already exists",
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "password cannot be null" },
        notEmpty: { msg: "password is required" },
        len: {
          args: [7, 255],
          msg: "password must be at least 7 characters long",
        },
        // isStrongPassword(value) {
        //   isStrongPassword(value);
        // },
      },
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "OWNER", "EMPLOYEE", "MANAGER", "SUPER ADMIN"),
      allowNull: false,
      validate: {
        notNull: { msg: "user role cannot be null" },
        notEmpty: { msg: "user role is required" },
        isIn: {
          args: [
            [
              "Admin", //admin toko
              "Owner", //pemilik toko
              "Employee", //karyawan toko
              "Manager", // manager toko
              "Super Admin", //khusus pemilik web
            ],
          ],
          msg: "user role was wrong",
        },
      },
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "User",
  }
);

export default User;
