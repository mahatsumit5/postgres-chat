export interface CustomError extends Error {
  statusCode: number;
}
declare global {
  namespace Express {
    interface Request {
      userInfo?: IUser;
    }
  }
}
