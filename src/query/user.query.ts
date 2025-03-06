import { executeQuery, prisma } from "../script";

type createUserParams = {
  email: string;
  password: string;
  fName: string;
  lName: string;
};

export function createUser(obj: createUserParams) {
  return executeQuery(
    prisma.user.create({
      data: obj,
    })
  );
}

export function changePassword({
  email,
  newPassword,
}: {
  email: string;
  newPassword: string;
}) {
  return executeQuery(
    prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: newPassword,
      },
    })
  );
}
export function uploadProfileImage(email: string, path: string) {
  return executeQuery(
    prisma.user.update({
      where: {
        email: email,
      },
      data: {
        profile: path,
      },
    })
  );
}
export function getUserByEmailAndUpdate(email: string, dataToUpdate: any) {
  return executeQuery(
    prisma.user.update({
      where: {
        email: email,
      },
      data: dataToUpdate,
    })
  );
}

export function getUserByEmail(email: string) {
  return executeQuery(
    prisma.user.findUnique({
      where: { email: email },
    })
  );
}

export function getUserById(id: string) {
  return executeQuery(
    prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
      },
    })
  );
}

export async function getAllUsers(
  email: string,
  take: number,
  page: number,
  order: "asc" | "desc",
  contains: string
) {
  const skipAmount = (page - 1) * take;
  const users: [] = await executeQuery(
    prisma.user.findMany({
      where: {
        NOT: {
          OR: [
            {
              chatRoom: {
                some: {
                  user: {
                    some: {
                      email: email,
                    },
                  },
                },
              },
            },
            {
              friendRequests: {
                some: { from: { email: email } },
              },
            },
            {
              email: email,
            },
          ],
        },
        email: {
          contains: contains.toLowerCase(),
        },
      },
      select: {
        fName: true,
        lName: true,
        email: true,
        profile: true,
        id: true,
      },
      take: take,
      orderBy: { fName: order },
      skip: skipAmount,
    })
  );

  const totalUsers = await executeQuery(
    prisma.user.count({
      where: {
        NOT: {
          chatRoom: {
            some: {
              user: {
                some: {
                  email: email,
                },
              },
            },
          },
        },
        email: {
          contains: contains || "",
        },
      },
    })
  );

  return { users, totalUsers };
}

export function deleteUser(id: string) {
  return executeQuery(
    prisma.user.delete({
      where: {
        id: id,
      },
    })
  );
}

export function deleteUserByEmail(email: string) {
  console.log(email);
  const data = executeQuery(
    prisma.user.delete({
      where: {
        email: email,
      },
    })
  );
  return data;
}

export function updateUser(userId: string, data: any) {
  return executeQuery(
    prisma.user.update({
      where: {
        id: userId,
      },
      data,
    })
  );
}
