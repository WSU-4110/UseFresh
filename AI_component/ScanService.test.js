import { ScanService } from "./ScanService.js";
import { jest } from "@jest/globals";

describe("ScanService", () => {
  let service;

  beforeEach(() => {
    service = new ScanService({});
  });

  test("buildScanPrompt returns the product prompt for product mode", () => {
    const prompt = service.buildScanPrompt("product");
    expect(prompt).toContain("product");
  });

  test("buildScanPrompt throws an error on invalid mode", () => {
    expect(() => service.buildScanPrompt("weird")).toThrow("Invalid mode");
  });

  test("extractImageData returns base64 image data and mime type", () => {
    const fakeFile = {
      buffer: Buffer.from("hello"),
      mimetype: "image/jpeg"
    };

    const result = service.extractImageData(fakeFile);

    expect(result.mimeType).toBe("image/jpeg");
    expect(result.base64Image).toBe(Buffer.from("hello").toString("base64"));
  });

  test("parseVisionResponse parses valid JSON", () => {
    const text = JSON.stringify({
      product_name: "Milk",
      confidence: 0.9,
      reason: "Detected milk carton shape and label"
    });

    const result = service.parseVisionResponse(text);

    expect(result.product_name).toBe("Milk");
    expect(result.confidence).toBe(0.9);
    expect(result.reason).toBe("Detected milk carton shape and label");
  });

    test("parseVisionResponse throws on invalid JSON", () => {
    expect(() => service.parseVisionResponse("not json")).toThrow();
  });

  test("normalizeExpirationDate returns ISO date unchanged", () => {
    expect(service.normalizeExpirationDate("2026-03-24")).toBe("2026-03-24");
  });

  test("normalizeExpirationDate converts YYYY/MM to first day of month", () => {
    expect(service.normalizeExpirationDate("2026/03")).toBe("2026-03-01");
  });

  test("normalizeExpirationDate returns null for an invalid date", () => {
    expect(service.normalizeExpirationDate("March someday")).toBeNull();
  });
});