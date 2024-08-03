import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Employee from './employee';

type StatusType = "Present" | "Absent" | "Sick" | "Leave";

@Table
class Attendance extends Model {
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
      notNull: { msg: "Date of Attendance cannot be null" },
      notEmpty: { msg: "Date of Attendance is required" },
    },
  })
  date!: Date;

  @Column({
    type: DataType.ENUM("Present", "Absent", "Sick", "Leave"),
    allowNull: false,
    validate: {
      notNull: { msg: "Status cannot be null" },
      notEmpty: { msg: "Status is required" },
      isIn: {
        args: [["Present", "Absent", "Sick", "Leave"]],
        msg: "Invalid Attendance Status",
      },
    },
    defaultValue: "Absent",
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

export default Attendance;
