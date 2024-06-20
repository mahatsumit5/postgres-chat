import { executeQuery, prisma } from "../../script";

export async function sendFriendRequest(from: string, to: string) {
  console.log(from, to);
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
      select: {
        to: {
          select: {
            id: true,
            fName: true,
            lName: true,
            email: true,
            profile: true,
          },
        },
        from: {
          select: {
            id: true,
            fName: true,
            lName: true,
            email: true,
            profile: true,
          },
        },
        status: true,
      },
    })
  );
  console.log("this is new fr req", result);
  return result;
}

export async function getFriendRequestByUser(id: string) {
  // Get friend requests sent by the user with this ID
  return await executeQuery(
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
        to: {
          select: {
            fName: true,
            lName: true,
            email: true,
            profile: true,
            id: true,
          },
        },
      },
    })
  );
}
export async function getYourSentRequest(
  id: string,
  skip: number,

  search: string
) {
  // Get friend requests sent by the user with this ID
  const result: [] = await executeQuery(
    prisma.friendRequests.findMany({
      where: {
        fromId: id,
        status: "PENDING",
        to: {
          email: {
            contains: search,
          },
        },
      },
      select: {
        to: {
          select: {
            id: true,
            fName: true,
            lName: true,
            email: true,
            profile: true,
          },
        },
        from: {
          select: {
            id: true,
            fName: true,
            lName: true,
            email: true,
            profile: true,
          },
        },
        status: true,
      },
      skip: skip,
      take: 10,
    })
  );
  const count = await executeQuery(
    prisma.friendRequests.count({
      where: {
        fromId: id,
        status: "PENDING",
        to: {
          email: {
            contains: search,
          },
        },
      },
    })
  );
  return { result, count };
}

export async function deleteSentRequest(fromId: string, toId: string) {
  return await executeQuery(
    prisma.friendRequests.delete({
      where: {
        fromId_toId: {
          fromId: fromId,
          toId: toId,
        },
      },
      select: {
        to: {
          select: {
            id: true,
            fName: true,
            lName: true,
            email: true,
            profile: true,
          },
        },
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
}

export async function getNumberOfFriendReq(email: string) {
  return await executeQuery(
    prisma.friendRequests.count({
      where: {
        to: {
          email,
        },
      },
    })
  );
}
