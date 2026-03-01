import LLMProvider from "./LLMProvider.js";
//provides a mock recipe as a fallback
export default class MockProvider extends LLMProvider {
  async chat(messages) {
    return JSON.stringify({
      title: "Pasta",
      ingredients: ["pasta", "olive oil", "garlic"],
      steps: ["Boil pasta", "Toss with oil and garlic", "Serve"]
    });
  }
}