import { RESTDataSource } from "@apollo/datasource-rest";
import { BaseAPI } from ".";
import { SentRequestResponse } from "../types/types";

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
}
