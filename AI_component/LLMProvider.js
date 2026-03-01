export default class LLMProvider {
  /**
   * @param {Array<{role: string, content: string}>} messages
   * @returns {Promise<string>} raw text from the model
   */
  async chat(messages) {
    throw new Error("chat() must be implemented by subclasses");
  }
}