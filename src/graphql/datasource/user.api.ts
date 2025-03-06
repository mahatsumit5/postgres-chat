import { RESTDataSource } from "@apollo/datasource-rest";
import {
  AllUsersResponse,
  LogInResponse,
  Response,
  SignInResponse,
  SignInUser,
  SignUpUser,
} from "../types/types";

export class UserAPI extends RESTDataSource {
  baseURL = "http://localhost:8080/api/v1/user/";

  async signUp(input: SignUpUser): Promise<Response> {
    try {
      const response = await this.post<Response>("sign-up", {
        body: input,
      });
      return response;
    } catch (error: any) {
      return {
        status: false,
        message:
          error.extensions.response.body.message || "unexpected error occured",
      };
    }
  }
  async signIn(input: SignInUser): Promise<SignInResponse> {
    try {
      return await this.post<SignInResponse>("sign-in", {
        body: input,
      });
    } catch (error: any) {
      return {
        status: false,
        message:
          error.extensions.response.body.message || "unexpected error occured",
      };
    }
  }

  async allUsers(): Promise<AllUsersResponse> {
    try {
      return await this.get<AllUsersResponse>("all-users", {});
    } catch (error: any) {
      return {
        status: false,
        message:
          error.extensions.response.body.message || "unexpected error occured",
      };
    }
  }

  async loggedInUser(): Promise<LogInResponse> {
    try {
      return await this.get("");
    } catch (error: any) {
      return {
        status: false,
        message:
          error.extensions.response.body.message || "unexpected error occured",
      };
    }
  }
}
