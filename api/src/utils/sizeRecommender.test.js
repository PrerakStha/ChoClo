import test from "node:test";
import assert from "node:assert/strict";
import { recommendSize } from "./sizeRecommender.js";
import { DEFAULT_SIZE_CHART as chart } from "../validators/sizeChart.js";

test("a 98 cm chest gets M with high confidence", () => {
  const r = recommendSize({ chart, chest: 98 });
  assert.equal(r.size, "M");
  assert.equal(r.confidence, "high");
});

test("a loose fit goes one size up", () => {
  assert.equal(recommendSize({ chart, chest: 98, fit: "loose" }).size, "L");
});

test("sold-out sizes are skipped", () => {
  const r = recommendSize({ chart, chest: 98, inStock: new Set(["S", "L"]) });
  assert.equal(r.size, "L");
  assert.ok(r.notes.length > 0);
});

test("measurements outside the chart give low confidence", () => {
  assert.equal(recommendSize({ chart, chest: 150 }).confidence, "low");
});

test("a boundary measurement mentions both sizes", () => {
  const r = recommendSize({ chart, chest: 94 });
  assert.ok(r.notes.some((note) => note.includes("between")));
});