import { hashSync, compareSync, hash, compare } from "bcryptjs";

export const hashPassword = (password: string): string => {
  return hashSync(password);
};

export const comparePassword = (input: string, passwordDb: string): boolean => {
  return compareSync(input, passwordDb);
};

export const hashAsyncPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await hash(password, saltRounds);
};

export const compareAsyncPassword = async (
  input: string,
  passwordDb: string
): Promise<boolean> => {
  return await compare(input, passwordDb);
};
