import { executeQuery, prisma } from "../../script";

export async function sendFriendRequest(from: string, to: string) {
  const result = await executeQuery(
    prisma.friendRequests.create({
      data: {
        from: {
          connect: { id: from },
        },
        to: {
          connect: { id: to },
        },
      },
    })
  );
  console.log(result);
  return result;
}

export async function getFriendRequestByUser(id: string) {
  // Get friend requests sent by the user with this ID
  const result = await executeQuery(
    prisma.friendRequests.findMany({
      where: {
        toId: id,
        status: "PENDING",
      },
      select: {
        from: {
          select: {
            fName: true,
            lName: true,
            email: true,
            profile: true,
            id: true,
          },
        },
        status: true,
      },
    })
  );

  return result;
}
export async function getYourSentRequest(id: string) {
  // Get friend requests sent by the user with this ID
  const result = await executeQuery(
    prisma.friendRequests.findMany({
      where: {
        fromId: id,
        status: "PENDING",
      },
      select: {
        to: {
          select: { fName: true, lName: true, email: true, profile: true },
        },
        status: true,
      },
    })
  );
  return result;
}

export async function deleteSentRequest(fromId: string, toId: string) {
  console.log(fromId, toId);
  const result = await executeQuery(
    prisma.friendRequests.delete({
      where: {
        fromId_toId: {
          fromId: fromId,
          toId: toId,
        },
      },
    })
  );
  console.log("This request has been deleted", result);
  return result;
}
export async function acceptFriendReq(fromId: string, toId: string) {
  const result = await executeQuery(
    prisma.friendRequests.update({
      where: {
        fromId_toId: {
          fromId: fromId,
          toId: toId,
        },
      },
      data: {
        status: "ACCEPTED",
      },
    })
  );
  return result;
}
