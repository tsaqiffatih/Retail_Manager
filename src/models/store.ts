import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import User from './user';
import Employee from './employee';

// Definisi model Store tanpa parameter generik
@Table
class Store extends Model {
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
      notNull: { msg: "Store name cannot be null" },
      notEmpty: { msg: "Store name is required" },
    },
    unique: {
      name: "Unique_Name_Constraint",
      msg: "Store name has already been taken",
    },
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Store location cannot be null" },
      notEmpty: { msg: "Store location is required" },
    },
  })
  location!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Store category cannot be null" },
      notEmpty: { msg: "Store category is required" },
      isIn: {
        args: [["Grocery Store", "Bookstore", "Restaurant & Cafe", "Other"]],
        msg: "Store category was wrong!",
      },
    },
  })
  category!: string;

  @Column({
    type: DataType.STRING,
  })
  code!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: "Owner Id cannot be null" },
      notEmpty: { msg: "Owner Id is required" },
    },
  })
  OwnerId!: number;

  @BelongsTo(() => User, { foreignKey: 'OwnerId', as: 'user' })
  user!: User;

  @HasMany(() => Employee, { foreignKey: 'StoreId', as: 'employees' })
  employees!: Employee[];

  static async findByOwnerId(userId: number): Promise<number[]> {
    const stores = await this.findAll({
      where: { OwnerId: userId },
      attributes: ['OwnerId'],
    });

    return stores.map(store => store.OwnerId);
  }
}

export default Store;
