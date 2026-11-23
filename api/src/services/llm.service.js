import { httpError } from "../utils/httpError.js";

const TIMEOUT_MS = 25000;

export async function generateJson({ prompt, image }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  if (!apiKey || !model) throw httpError(503, "AI service not configured");

  const parts = [{ text: prompt }];
  if (image) {
    parts.push({
      inline_data: {
        mime_type: image.mimeType || image.mimetype || "image/png",
        data: image.buffer.toString("base64"),
      },
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res;
  try {
    res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{ role: "user", parts }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.4,
          },
        }),
        signal: controller.signal,
      }
    );
  } catch (error) {
    if (error.name === "AbortError") throw httpError(504, "AI service timeout");
    throw httpError(503, "AI service unavailable");
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 429) throw httpError(429, "AI service rate limit exceeded");
  if (!res.ok) throw httpError(503, "AI service error");

  const data = await res.json();
  const text = (data.candidates?.[0]?.content?.parts ?? [])
    .map((p) => p.text)
    .filter(Boolean)
    .join("");

  try {
    return JSON.parse(text);
  } catch {
    throw httpError(
      502,
      "The assistant returned an unexpected answer. Please try again."
    );
  }
}