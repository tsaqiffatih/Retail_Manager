import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './user';

type ActionType = "CREATE" | "READ" | "DELETE" | "UPDATE" | "READ ONE";

@Table
class AuditLog extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.ENUM("CREATE", "READ", "DELETE", "UPDATE", "READ ONE"),
    allowNull: false,
    validate: {
      notNull: { msg: "Action cannot be null" },
      notEmpty: { msg: "Action is required" },
      isIn: {
        args: [["CREATE", "READ", "DELETE", "UPDATE", "READ ONE"]],
        msg: "Invalid Action Type",
      },
    },
  })
  action!: ActionType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  entity_name!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  entity_id?: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  previous_data?: JSON;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  new_data?: JSON;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    validate: {
      notNull: { msg: "Timestamp cannot be null" },
      notEmpty: { msg: "Timestamp is required" },
    },
  })
  timestamp!: Date;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: "User Id cannot be null" },
      notEmpty: { msg: "User Id is required" },
    },
  })
  UserId!: number;

  @BelongsTo(() => User, { foreignKey: 'UserId' })
  user!: User;

  static async createLog(params: {
    action: ActionType;
    entity_name: string;
    entity_id?: number;
    previous_data?: JSON;
    new_data?: JSON;
    timestamp: Date;
    UserId: number;
  }) {
    try {
      const { action, entity_name, entity_id, previous_data, new_data, timestamp, UserId } = params;

      await this.create({
        action, entity_name, entity_id, previous_data, new_data, timestamp, UserId
      });
    } catch (error) {
      console.error("Failed to log audit:", error);
      throw error;
    }
  }
}

export default AuditLog;
