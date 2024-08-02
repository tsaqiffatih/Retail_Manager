import { Model, DataTypes, Optional, Sequelize } from "sequelize";
// import sequelize from '../sequelize'; // Mengimpor instance sequelize
import sequelizeConnection from "../config/connection";

// Definisi atribut Store
export interface StoreAttributes {
  id: number;
  name: string;
  location: string;
  category: string;
  code: string;
  OwnerId: number;
}

// Definisi atribut untuk pembuatan Store
export interface StoreCreationAttributes
  extends Optional<StoreAttributes, "id"> {}

// Definisi kelas Store
class Store
  extends Model<StoreAttributes, StoreCreationAttributes>
  implements StoreAttributes
{
  public id!: number;
  public name!: string;
  public location!: string;
  public category!: string;
  public code!: string;
  public OwnerId!: number;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Definisikan hubungan (associations) di sini
    Store.belongsTo(models.User, { foreignKey: "OwnerId" });
    Store.hasMany(models.Employee, { foreignKey: "StoreId" });
  }

  static async findByOwnerId(userId: number) {
    const stores = await this.findAll({
    where: { OwnerId: userId },
    attributes: ['OwnerId'],
  });

  return stores.map(store => store.OwnerId);
  }
}
// Inisialisasi model
Store.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Store name cannot be null" },
        notEmpty: { msg: "Store name is required" },
      },
      unique: {
        name: "Unique_Name_Constraint",
        msg: "Store name has already been taken",
      },
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Store location cannot be null" },
        notEmpty: { msg: "Store location is required" },
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Store category cannot be null" },
        notEmpty: { msg: "Store category is required" },
        isIn: {
          args: [["Grocery Store", "Bookstore", "Restaurant & Cafe", "Other"]],
          msg: "Store category was wrong!",
        },
      },
    },
    OwnerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Owner Id cannot be null" },
        notEmpty: { msg: "Owner Id is required" },
      },
    },
    code: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "Store",
  }
);

export default Store;
