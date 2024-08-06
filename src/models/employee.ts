import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Payroll from './payroll';
import Attendance from './attendance';
import User from './user';
import Store from './store';

@Table
class Employee extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "First name cannot be null" },
      notEmpty: { msg: "First name is required" },
    },
  })
  firstName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Last name cannot be null" },
      notEmpty: { msg: "Last name is required" },
    },
  })
  lastName!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    validate: {
      notNull: { msg: "Date of birth cannot be null" },
      notEmpty: { msg: "Date of birth is required" },
    },
  })
  dateOfBirth!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Contact cannot be null" },
      notEmpty: { msg: "Contact is required" },
    },
  })
  contact!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Education cannot be null" },
      notEmpty: { msg: "Education is required" },
    },
  })
  education!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address?: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Position cannot be null" },
      notEmpty: { msg: "Position is required" },
    },
  })
  position!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: "Salary cannot be null" },
      notEmpty: { msg: "Salary is required" },
    },
  })
  salary!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: "UserId cannot be null" },
      notEmpty: { msg: "UserId is required" },
    },
  })
  UserId!: number;

  @ForeignKey(() => Store)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: "StoreId cannot be null" },
      notEmpty: { msg: "StoreId is required" },
    },
  })
  StoreId!: number;

  @BelongsTo(() => User, { foreignKey: 'UserId' , onDelete: 'CASCADE'})
  user!: User;

  @BelongsTo(() => Store, { foreignKey: 'StoreId', onDelete: 'CASCADE' })
  store!: Store;

  @HasMany(() => Payroll, { foreignKey: 'EmployeeId' })
  payrolls!: Payroll[];

  @HasMany(() => Attendance, { foreignKey: 'EmployeeId' })
  attendances!: Attendance[];

  static async findByOwnerId(userId: number): Promise<number[]> {
    const employees = await this.findAll({
      where: { UserId: userId },
      attributes: ['UserId'],
    });

    return employees.map(employee => employee.UserId);
  }
}

export default Employee;
