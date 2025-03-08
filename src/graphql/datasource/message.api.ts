import { BaseAPI } from ".";

export class MessageApi extends BaseAPI {
  /**
   * Sends a message
   * @param {string} message - The message to be sent
   * @returns {Promise<void>}
   */
  async sendMessage(message: string): Promise<void> {
    // todo implement send message logic
  }

  /**
   * Retrieves messages
   * @returns {Promise<string[]>}
   */
  async getMessages() {
    // todo implement get messages logic
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
