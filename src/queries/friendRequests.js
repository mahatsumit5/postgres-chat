import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * This function sends friend requests to users.
 * It first retrieves all users who have not been sent a friend request by the current user.
 * Then, it creates a friend request for each user.
 */
export async function sendfriendRequests(from, to) {
  // Retrieve all users who have not been sent a friend request by the current user.
  try {
    return await prisma.friendRequests.create({
      data: {
        from: {
          connect: { id: from },
        },
        to: { connect: { id: to } },
      },
    });
  } catch (error) {
    console.log("this is error", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getMySentFriendRequests(id) {
  try {
    const requests = await prisma.friendRequests.findMany({
      where: {
        fromId: id,
        status: "PENDING",
      },
    });
    return requests;
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}
export async function getMyFriendRequests(id) {
  try {
    const requests = await prisma.friendRequests.findMany({
      where: {
        toId: id,
        status: "PENDING",
      },
    });
    return requests;
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateRequestsStatus({ from, to, status }) {
  try {
    return await prisma.friendRequests.update({
      where: {
        fromId_toId: {
          fromId: from,
          toId: to,
        },
      },
      data: { status },
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function deleteFriendRequest({ from, to }) {
  try {
    return await prisma.friendRequests.delete({
      where: {
        fromId_toId: {
          fromId: from,
          toId: to,
        },
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}
