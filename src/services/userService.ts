// src/services/userService.ts
import User, { UserRole }  from '../models/user';
import { comparePassword, hashPassword } from '../helper/bcrypt';
import { createToken } from '../helper/jsonWebToken';

export const findUserByEmail = async (email: string) => {
  return User.findOne({ where: { email } });
};

export const validatePassword = (inputPassword: string, storedPassword: string) => {
  return comparePassword(inputPassword, storedPassword);
};

export const registerUser = async (email: string, userName: string, password: string,role:UserRole) => {
  const hashedPassword = hashPassword(password);
  return User.create({ email, userName, password: hashedPassword,role });
};

export const generateAccessToken = (user: any) => {
  return createToken({
    email: user.email,
    username: user.username,
  });
};
