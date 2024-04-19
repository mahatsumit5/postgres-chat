import { executeQuery, prisma } from "../../script";
export async function createSession({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  return await executeQuery(
    prisma.session.create({
      data: {
        token,
        associate: {
          connect: { email: email },
        },
      },
    })
  );
}
export async function findSessionAndDel(token: string, email: string) {
  return executeQuery(
    prisma.session.delete({
      where: {
        userEmail_token: {
          userEmail: email,
          token,
        },
      },
    })
  );
}

export async function getAllSession() {
  return executeQuery(prisma.session.findMany());
}
