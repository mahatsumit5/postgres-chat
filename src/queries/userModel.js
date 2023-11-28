import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createUser(obj) {
  try {
    return await prisma.user.create({
      data: obj,
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getUser() {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function changePassword({ email, newPassword }) {
  try {
    return await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: newPassword,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}
export async function uploadProfileImage(email, path) {
  try {
    return await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        profile: path,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
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
    });
    console.log(user);
    return user;
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getAllUsers(email, roomId) {
  try {
    const users = await prisma.user.findMany({
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
    });

    return users;
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteUser(id) {
  try {
    return await prisma.user.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}
