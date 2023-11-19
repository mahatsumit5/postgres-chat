import bcrypt from "bcrypt";
const saltRouds = 10;
export const hashPass = (plainPassword) => {
  return bcrypt.hashSync(plainPassword, saltRouds);
};
export const comparePassword = (plainPassword, password) => {
  return bcrypt.compareSync(plainPassword, password);
};
