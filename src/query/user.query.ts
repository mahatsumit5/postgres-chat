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
      include: {
        chatRoom: {
          select: {
            user: true,
            id: true,
            messages: true,
          },
        },
      },
    })
  );
}

export async function getAllUsers(email: string, roomId: string) {
  return executeQuery(
    prisma.user.findMany({
      where: {
        NOT: {
          email: email,
        },
        chatRoom: {
          none: {
            id: roomId,
          },
        },
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
