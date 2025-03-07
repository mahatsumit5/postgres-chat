import { RESTDataSource } from "@apollo/datasource-rest";
import { BaseAPI } from ".";
import {
  DeleteRequestParams,
  FriendRequestResponse,
  QueryParamsSentReq,
  Response,
  SentRequestResponse,
} from "../types/types";

export class FriendRequestAPI extends BaseAPI {
  async sendRequest(to: string): Promise<SentRequestResponse> {
    try {
      return this.post<SentRequestResponse>("send-request", {
        body: {
          to,
        },
      });
    } catch (error) {
      return this.handleError(error);
    }
  }
  async deleteFriendRequest(
    params: DeleteRequestParams
  ): Promise<SentRequestResponse> {
    try {
      return this.delete<SentRequestResponse>(
        `/${params.fromId}/${params.toId}`
      );
    } catch (error) {
      return this.handleError(error);
    }
  }
  async acceptFriendRequest(body: DeleteRequestParams): Promise<Response> {
    try {
      return this.patch<Response>("/", {
        body,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getFriendRequest(): Promise<FriendRequestResponse> {
    return this.get("/friend-request");
  }
  async getSentFriendRequest({ page, search, take }: QueryParamsSentReq) {
    return this.get(`sent-request?page=${page}&search=${search}&take=${take}`);
  }
}
