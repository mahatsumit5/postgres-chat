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
import type { KeyValueCache } from "@apollo/utils.keyvaluecache";
export class UserAPI extends RESTDataSource {
  baseURL = "http://localhost:8080/api/v1/user/";
  private token: string;
  constructor(options: { token: string; cache: KeyValueCache }) {
    super(options); // this sends our server's `cache` through
    this.token = options.token;
  }

  override willSendRequest(_path: string, request: AugmentedRequest) {
    request.headers["authorization"] = this.token;
  }

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

  async allUsers({
    order,
    page,
    take,
    search,
  }: AllUser): Promise<AllUsersResponse> {
    try {
      return await this.get<AllUsersResponse>(
        `all-users?order=${order}&page=${page}&take=${take}&search=${search}`,
        {
          headers: {
            authorization: `Bearer ${this.token}`,
          },
        }
      );
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
      return await this.get("/loggedin", {
        headers: {
          authorization: `Bearer ${this.token}`,
        },
      });
    } catch (error: any) {
      return {
        status: false,
        message:
          error.extensions.response.body.message || "unexpected error occured",
      };
    }
  }
  async logout(): Promise<Response> {
    try {
      return await this.post("logout");
    } catch (error: any) {
      return {
        status: false,
        message:
          error.extensions.response.body.message || "unexpected error occured",
      };
    }
  }
  async newJwt(): Promise<Response> {
    try {
      return await this.patch("new-accessJWT", {});
    } catch (error: any) {
      return {
        status: false,
        message:
          error.extensions.response.body.message || "unexpected error occured",
      };
    }
  }
  async resetPassword(password: string): Promise<Response> {
    try {
      return await this.put("reset-password", {
        body: { password },
      });
    } catch (error: any) {
      return {
        status: false,
        message:
          error.extensions.response.body.message || "unexpected error occured",
      };
    }
  }
  async updateUser(): Promise<Response> {
    try {
      return await this.post("logout");
    } catch (error: any) {
      return {
        status: false,
        message:
          error.extensions.response.body.message || "unexpected error occured",
      };
    }
  }
}
