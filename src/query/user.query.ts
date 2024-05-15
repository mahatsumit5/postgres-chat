import { Url } from "url";
import { executeQuery, prisma } from "../../script";

type createUserParams = {
  email: string;
  password: string;
  fName: string;
  lName: string;
};
export async function createUser(obj: createUserParams) {
  console.log(obj);
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
  return executeQuery(
    prisma.user.findUnique({
      where: { email: email },
    })
  );
}

export async function getAllUsers(email: string) {
  return executeQuery(
    prisma.user.findMany({
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
      },
      select: {
        fName: true,
        lName: true,
        email: true,
        profile: true,
        id: true,
      },
    })
  );
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
