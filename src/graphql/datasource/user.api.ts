import { AugmentedRequest, RESTDataSource } from "@apollo/datasource-rest";
import {
  AllUser,
  AllUsersResponse,
  LogInResponse,
  Response,
  SignInResponse,
  SignInUser,
  SignUpUser,
} from "../types/types";
import { BaseAPI } from ".";
export class UserAPI extends BaseAPI {
  override baseURL = "http://localhost:8080/api/v1/user/";

  async signUp(input: SignUpUser): Promise<Response> {
    try {
      const response = await this.post<Response>("sign-up", {
        body: input,
      });
      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }
  async signIn(input: SignInUser): Promise<SignInResponse> {
    try {
      return await this.post<SignInResponse>("sign-in", {
        body: input,
      });
    } catch (error) {
      this.didEncounterError(error as Error);
      return this.handleError(error);
    }
  }

  async allUsers({
    order,
    page,
    take,
    search,
  }: AllUser): Promise<AllUsersResponse> {
    try {
      return await this.get<AllUsersResponse>(
        `all-users?order=${order}&page=${page}&take=${take}&search=${search}`
      );
    } catch (error) {
      return this.handleError(error);
    }
  }

  async loggedInUser(): Promise<LogInResponse> {
    try {
      return await this.get("loggedin");
    } catch (error) {
      return this.handleError(error);
    }
  }
  async logout(): Promise<Response> {
    try {
      return await this.post("logout");
    } catch (error) {
      return this.handleError(error);
    }
  }
  async newJwt(): Promise<Response> {
    try {
      return await this.patch("new-accessJWT", {});
    } catch (error) {
      return this.handleError(error);
    }
  }
  async resetPassword(password: string): Promise<Response> {
    try {
      return await this.put("reset-password", {
        body: { password },
      });
    } catch (error) {
      return this.handleError(error);
      throw error;
    }
  }
  async updateUser(): Promise<Response> {
    try {
      return await this.post("logout");
    } catch (error) {
      return this.handleError(error);
    }
  }
}
