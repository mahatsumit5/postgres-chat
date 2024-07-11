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

export async function changePassword({
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
export async function uploadProfileImage(email: string, path: string) {
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
export async function getUserByEmailAndUpdate(
  email: string,
  dataToUpdate: any
) {
  return executeQuery(
    prisma.user.update({
      where: {
        email: email,
      },
      data: dataToUpdate,
    })
  );
}

export async function getUserByEmail(email: string) {
  return await executeQuery(
    prisma.user.findUnique({
      where: { email: email },
    })
  );
}

export async function getUserById(id: string) {
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

export async function deleteUser(id: string) {
  return executeQuery(
    prisma.user.delete({
      where: {
        id: id,
      },
    })
  );
}

export async function deleteUserByEmail(email: string) {
  console.log(email);
  const data = await executeQuery(
    prisma.user.delete({
      where: {
        email: email,
      },
    })
  );
  console.log(data);
  return data;
}
