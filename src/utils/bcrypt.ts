import bcrypt from "bcrypt";
const saltRouds = 10;
export const hashPass = (plainPassword: string) => {
  return bcrypt.hashSync(plainPassword, saltRouds);
};
export const comparePassword = (plainPassword: string, password: string) => {
  return bcrypt.compareSync(plainPassword, password);
};
