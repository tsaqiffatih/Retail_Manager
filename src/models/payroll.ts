import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Employee from './employee';

type StatusType = "PAID" | "UNPAID";

@Table
class Payroll extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    validate: {
      notNull: { msg: "Date of Payroll cannot be null" },
      notEmpty: { msg: "Date of Payroll is required" },
    },
  })
  date!: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: "Amount cannot be null" },
      notEmpty: { msg: "Amount is required" },
    },
  })
  amount!: number;

  @Column({
    type: DataType.ENUM("PAID", "UNPAID"),
    allowNull: false,
    validate: {
      notNull: { msg: "Status cannot be null" },
      notEmpty: { msg: "Status is required" },
      isIn: {
        args: [["PAID", "UNPAID"]],
        msg: "Invalid Payroll Status",
      },
    },
  })
  status!: StatusType;

  @ForeignKey(() => Employee)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: "Employee Id cannot be null" },
      notEmpty: { msg: "Employee Id is required" },
    },
  })
  EmployeeId!: number;

  @BelongsTo(() => Employee, { foreignKey: 'EmployeeId' })
  employee!: Employee;
}

export default Payroll;
