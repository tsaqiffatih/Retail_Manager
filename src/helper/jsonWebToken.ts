import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TokenPayload } from '../interface/auth';

dotenv.config();

const secret = process.env.SECRET;

if (!secret) {
  throw new Error("SECRET is not defined in environment variables");
}

export const createToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, secret);
};

export const verifyToken = (token: string): JwtPayload | string => {
  return jwt.verify(token, secret);
};
