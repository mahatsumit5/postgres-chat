interface Issue {
  code: string;
  maximum: number;
  type: string;
  inclusive: boolean;
  exact: boolean;
  message: string;
  path: string[];
}

export interface CustomError extends Error {
  statusCode: number;
  issues: Issue[];
}

export interface IUser {
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
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;
      WEB_DOMAIN: string;
      ENVIRONMENT: string;
      AWS_BUCKET_NAME: string;
      AWS_REGION: string;
      AWS_ACCESS_KEY: string;
      AWS_SECRET_KEY: string;
      audience: string;
      issuerBaseURL: string;
      Request_Token_URL: string;
      client_id: string;
      client_secret: string;
      BASE_URL: string;
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

declare interface CreatePostParams {
  title: string;
  content: string;
  id: string;
  images: string[];
}
declare type UpdataPostParams = {
  id: string;
  title: string;
  content: string;
  images?: string[];
};

declare type CreateCommentParams = {
  content: string;
  postId: string;
  userId: string;
};
declare type UpdateCommentParams = {
  commentId: string;
  uid: string;
  content: string;
};
