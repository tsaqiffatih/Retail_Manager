"use strict";
import { DataTypes, Model, Optional } from "sequelize";
import sequelizeConnection from "../config/connection";

type ActionType = "CREATE" | "READ" | "DELETE" | "UPDATE" | "READ ONE";

export interface AuditLogAttributes {
  id: number;
  action: ActionType;
  entity?: string;
  entity_id?: number;
  entity_snapshot?: JSON;
  timestamp: Date;
  UserId: number;
}

export interface AuditLogCreationAttributes
  extends Optional<AuditLogAttributes, "id"> {}

export  interface CreateLogParams {
    action: ActionType;
    entity?: string;
    entity_id?: number;
    entity_snapshot?: JSON;
    timestamp: Date;
    UserId: number;
  }

class AuditLog
  extends Model<AuditLogAttributes, AuditLogCreationAttributes>
  implements AuditLogAttributes
{
  public id!: number;
  public action!: ActionType;
  public entity?: string;
  public entity_id?: number;
  public entity_snapshot?: JSON;
  public timestamp!: Date;
  public UserId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // define association here
    AuditLog.belongsTo(models.User, {foreignKey: "UserId"})
  }

  static async createLog (params: CreateLogParams) {
    try {
      const {action, entity, entity_id, entity_snapshot, timestamp, UserId} = params

      await this.create ({
        action, entity, entity_id, entity_snapshot, timestamp, UserId
      })
    } catch (error) {
      console.error("Failed to log audit:", error);
      throw error
    }
  }
}
AuditLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    action: {
      type: DataTypes.ENUM("CREATE", "READ", "DELETE", "UPDATE", "READ ONE"),
      allowNull: false,
      validate: {
        notNull: { msg: "Action cannot be null" },
        notEmpty: { msg: "Action is required" },
        isIn: {
          args: [["CREATE", "READ", "DELETE", "UPDATE", "READ ONE"]],
          msg: "Invalid Action Type",
        },
      },
    },
    entity: {
      type: DataTypes.STRING,
    },
    entity_id: {
      type: DataTypes.INTEGER,
    },
    entity_snapshot: {
      type: DataTypes.JSON,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: "Timestamp cannot be null" },
        notEmpty: { msg: "Timestamp is required" },
      },
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "User Id cannot be null" },
        notEmpty: { msg: "User Id is required" },
      },
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: "AuditLog",
  }
);

export default AuditLog;