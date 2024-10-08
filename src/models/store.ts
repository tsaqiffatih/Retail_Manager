import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import User from './user';
import Employee from './employee';
import { isValidIndonesianLocation } from '../helper/locationValidation';
import { generateStoreCodeTs } from '../helper/codeGenerator';
import { isValidCategory } from '../helper/isValidCategory';

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
      notEmpty: { msg: "Store name is required" },
      notNull: { msg: "Store name cannot be null" },
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
      notEmpty: { msg: "Store location is required" },
      notNull: { msg: "Store location cannot be null" },
      isValidLocationCheck(value: string) {
        if(!isValidIndonesianLocation(value)) {
          throw new Error ("Store location must be in indonesia location")
        }
      }
    },
  })
  location!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Store category is required" },
      notNull: { msg: "Store category cannot be null" },
      isValidCategoryCheck(value: string) {
        if(!isValidCategory(value)) {
          throw new Error ("Invalid Store Category")
        }
      }
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

  @BelongsTo(() => User, { foreignKey: 'OwnerId' , onDelete: 'CASCADE'})
  user!: User;

  @HasMany(() => Employee, { foreignKey: 'StoreId', onDelete: 'CASCADE' })
  employees!: Employee[];

  @BeforeUpdate
  @BeforeCreate
  static async createStoreCode(store: Store) {
    const user = await User.findByPk(store.OwnerId) 
    if (!user) {
      throw {name: 'Not Found', param: 'User'}
    }
    store.code = generateStoreCodeTs(
      user?.userName,store.category,store.location,new Date(),store.OwnerId
    )
  }

  static async findByOwnerId(userId: number): Promise<number[]> {
    const stores = await this.findAll({
      where: { OwnerId: userId },
      attributes: ['OwnerId'],
    });

    return stores.map(store => store.OwnerId);
  }
}

export default Store;
