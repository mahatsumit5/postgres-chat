import { executeQuery, prisma } from "../../script";

type createUserParams = {
  email: string;
  password: string;
  fName: string;
  lName: string;
};
export async function createUser(obj: createUserParams) {
  return await executeQuery(
    prisma.user.create({
      data: obj,
    })
  );
}
export async function getUser() {
  const users = await executeQuery(prisma.user.findMany());
  return users;
}
