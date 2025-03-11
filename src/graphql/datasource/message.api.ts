import { BaseAPI } from ".";
import {
  GetMessageByUser,
  GetMessageByUserResponse,
  SendMessageParams,
  SendMessageResponse,
} from "../types/types";

export class MessageApi extends BaseAPI {
  override baseURL = `${process.env.BASE_URL}/message/`;

  /**
   * Sends a message
   * @param {string} message - The message to be sent
   * @returns {Promise<void>}
   */
  async sendMessage(body: SendMessageParams): Promise<SendMessageResponse> {
    // todo implement send message logic
    return this.post("/", {
      body,
    });
  }

  /**
   * Retrieves messages
   * @returns {Promise<string[]>}
   */
  async getMessages({
    roomId,
    skip,
    take,
  }: GetMessageByUser): Promise<GetMessageByUserResponse> {
    // todo implement get messages logic
    return this.get(`/?id=${roomId}&take=${take}&skip=${skip}`);
  }

  /**
   * Deletes a message
   * @param {string} messageId - The ID of the message to be deleted
   * @returns {Promise<void>}
   */
  async deleteMessage(messageId: string): Promise<void> {
    // todo implement delete message logic
  }
}
