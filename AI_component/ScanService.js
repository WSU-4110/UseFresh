export class ScanService {
  constructor(hf) {
    this.hf = hf;
  }

  buildScanPrompt(mode) {
    if (mode === "product") {
      return `
You are reading a grocery product label.

Identify the main product name shown in the image.

Return ONLY valid JSON:
{
  "product_name": string | null,
  "confidence": number,
  "reason": string
}
`.trim();
    }

    if (mode === "expiration") {
      return `
You are reading a grocery expiration label.

Identify any expiration, best-by, use-by, or sell-by date.

Return ONLY valid JSON:
{
  "expiration_date": string | null,
  "confidence": number,
  "reason": string
}
`.trim();
    }

    throw new Error("Invalid mode");
  }

  extractImageData(file) {
    if (!file) {
      throw new Error("No frame uploaded");
    }

    return {
      base64Image: file.buffer.toString("base64"),
      mimeType: file.mimetype || "image/jpeg"
    };
  }

  parseVisionResponse(text) {
    if (!text) {
      throw new Error("No content returned from vision model");
    }

    const cleaned = text
      .replace(/```json\s*/i, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  }

  normalizeExpirationDate(dateStr) {
    if (!dateStr) return null;

    const cleaned = dateStr.trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
      return cleaned;
    }

    if (/^\d{4}\/\d{2}$/.test(cleaned)) {
      const [year, month] = cleaned.split("/");
      return `${year}-${month}-01`;
    }

    if (/^\d{4}-\d{2}$/.test(cleaned)) {
      return `${cleaned}-01`;
    }

    return null;
  }

  formatScanResult(mode, parsed) {
    if (mode === "product") {
      return {
        success: true,
        detected: Boolean(parsed.product_name),
        product_name: parsed.product_name ?? null,
        confidence: parsed.confidence ?? 0,
        reason: parsed.reason ?? ""
      };
    }

    const normalizedDate = this.normalizeExpirationDate(parsed.expiration_date);

    return {
      success: true,
      detected: Boolean(normalizedDate),
      expiration_date: normalizedDate,
      confidence: parsed.confidence ?? 0,
      reason: parsed.reason ?? ""
    };
  }

  async scan(file, mode) {
    const prompt = this.buildScanPrompt(mode);
    const { base64Image, mimeType } = this.extractImageData(file);

    const chat = await this.hf.chatCompletion({
      model: "Qwen/Qwen2.5-VL-7B-Instruct",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 200,
      temperature: 0.2
    });

    const text = chat.choices?.[0]?.message?.content?.trim();
    const parsed = this.parseVisionResponse(text);
    return this.formatScanResult(mode, parsed);
  }
}