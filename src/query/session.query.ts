import { executeQuery, prisma } from "../script";
export function createSession({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  return executeQuery(
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
export function findSessionAndDelete(token: string, email: string) {
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

export function getAllSession() {
  return executeQuery(prisma.session.findMany());
}

export function getSession(token: string) {
  return executeQuery(
    prisma.session.findFirst({
      where: {
        token,
      },
      select: {
        associate: true,
      },
    })
  );
}
