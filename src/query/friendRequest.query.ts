import { executeQuery, prisma } from "../../script";

export function sendFriendRequest(from: string, to: string) {
  const result = executeQuery(
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

export function getFriendRequestByUser(id: string) {
  // Get friend requests sent by the user with this ID
  return executeQuery(
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
            bio: true,
            coverPicture: true,
            isActive: true,
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
        toId: true,
      },
    })
  );
}
export function getYourSentRequest(
  id: string,
  page: number,
  take: number,
  search: string
) {
  console.log(page, take);
  // Get friend requests sent by the user with this ID
  const result: Promise<[]> = executeQuery(
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
      skip: (page - 1) * 7,
      take: take,
    })
  );
  const count = executeQuery(
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

export function deleteSentRequest(fromId: string, toId: string) {
  return executeQuery(
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

export function getNumberOfFriendReq(email: string) {
  return executeQuery(
    prisma.friendRequests.count({
      where: {
        to: {
          email,
        },
      },
    })
  );
}
