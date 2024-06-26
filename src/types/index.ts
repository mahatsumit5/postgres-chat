export interface CustomError extends Error {
  statusCode: number;
}

interface IUser {
  id: string;
  email: string;
  fName: string;
  lName: string;
  isActive: boolean;
  password: string;
  profile: null | string;
  refreshJWT: string | null;
}
export type jwtReturnType =
  | { email: string; iat: number; exp: number }
  | undefined;
declare global {
  namespace Express {
    interface Request {
      userInfo?: IUser;
    }
  }
}

export interface IRoom {
  id: string;
  user: IUser[];
}

export type message = {
  id: string;
  content: string;
  createdAt: Date;
  isSeen: boolean;
  chatRoomId: string;
  author: string;
};
