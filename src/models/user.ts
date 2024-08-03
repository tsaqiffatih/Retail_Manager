import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, HasOne, BeforeCreate } from 'sequelize-typescript';
import Employee from './employee';
import Store from './store';
import AuditLog from './auditlog';
import { hashAsyncPassword } from '../helper/bcrypt';
import { isStrongPassword } from '../helper/isStrongPassword';

export type UserRole = "ADMIN" | "OWNER" | "EMPLOYEE" | "MANAGER" | "SUPER ADMIN";

@Table
class User extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: {
      name: "Unique_Name_Constraint",
      msg: "userName has been already exists",
    },
  })
  userName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: {
      name: "Unique_Email_Constraint",
      msg: "email has been already exists",
    },
    validate: {
      isEmail: { msg: "Invalid Email Type" },
    },
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [7, 255],
        msg: "password must be at least 7 characters long",
      },
    },
  })
  password!: string;

  @Column({
    type: DataType.ENUM("ADMIN", "OWNER", "EMPLOYEE", "MANAGER", "SUPER ADMIN"),
    allowNull: false,
    validate: {
      isIn: {
        args: [
          ["ADMIN", "OWNER", "EMPLOYEE", "MANAGER", "SUPER ADMIN"],
        ],
        msg: "user role was wrong",
      },
    },
  })
  role!: UserRole;

  @HasMany(() => Store, { foreignKey: "OwnerId", as: "user" })
  stores!: Store[];

  @HasOne(() => Employee, { foreignKey: "UserId", as: "employee" })
  employee!: Employee;

  @HasMany(() => AuditLog, { foreignKey: "UserId", as: "auditLog" })
  auditLogs!: AuditLog[];

  @BeforeCreate
  static async validateAndHashPassword(user: User) {
    await isStrongPassword(user.password);  // Validasi kekuatan password
    user.password = await hashAsyncPassword(user.password);
  }

}

export default User;
