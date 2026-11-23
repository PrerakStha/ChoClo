//explain each function in this file

function rangeDistance(value, min, max) {
  if (value < min) return min - value; // If the value is less than the minimum, return the distance from the minimum
  if (max < value) return value - max; // If the value is greater than the maximum, return the distance from the maximum
  return 0; // If the value is within the range, return 0
}

export function rankSizes(chart, { chest, waist }) {
  return chart
    .map((row, index) => {
      let distance = rangeDistance(chest, row.chestMin, row.chestMax); // Calculate the distance for chest measurement
      if (waist != null && row.waistMin != null && row.waistMax != null) {
        distance += rangeDistance(waist, row.waistMin, row.waistMax); // Add the distance for waist if waist is provided and the chart has waist measurements
      }
      const center = Math.abs(chest - (row.chestMin + row.chestMax) / 2); // Calculate the distance from the center of the chest range
      return { row, index, distance, center }; // Return an object containing the index, total distance, and center distance
    })
    .sort((a, b) => a.distance - b.distance || a.center - b.center); // Sort the results first by distance, then by center distance
}

export function recommendSize({
  chart,
  chest,
  waist,
  fit = "regular",
  inStock,
}) {
  if (!chart || chart.length === 0) return null;

  const ranked = rankSizes(chart, { chest, waist }); // Rank the sizes based on the provided chest and waist measurements
  const best = ranked[0];
  const second = ranked[1];

  const targetIndex = Math.min(
    chart.length - 1,
    best.index + (fit === "loose" ? 1 : 0),
  );
  const available = chart
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => !inStock || inStock.has(row.size.toUpperCase())); // Filter the chart to only include sizes that are in stock if inStock is provided

  if (available.length === 0)
    return {
      size: null,
      bestMatch: chart[best.index].size,
      alternatives: [],
      confidence: "low",
      notes: ["Every size is sold out right now."],
    }; // If no sizes are available, return a low confidence recommendation with a note

  const preferLarger = fit !== "fitted";
  const byCloseness = [...available].sort(
    (a, b) =>
      Math.abs(a.index - targetIndex) - Math.abs(b.index - targetIndex) ||
      (preferLarger ? b.index - a.index : a.index - b.index),
  );
  const pick = byCloseness[0];

  const confidence =
    best.distance === 0 ? "high" : best.distance <= 2 ? "medium" : "low";

  const notes = [];
  if (
    fit === "loose" &&
    pick.index === targetIndex &&
    targetIndex !== best.index
  ) {
    notes.push("We went one size up for a looser fit.");
  }
  if (pick.index !== targetIndex) {
    notes.push(
      `Your ideal size is ${chart[targetIndex].size}, but it is sold out. ${pick.row.size} is the closest available.`,
    );
  }
  if (second && best.distance === 0 && second.distance === 0) {
    notes.push(
      `You are between ${chart[Math.min(best.index, second.index)].size} and ${chart[Math.max(best.index, second.index)].size}. Pick the smaller for a snug fit or the larger for a relaxed one.`,
    );
  }
  if (confidence === "low") {
    notes.push(
      "Your measurements are outside our size chart, so please check the size guide or contact us before ordering.",
    );
  }

  return {
    size: pick.row.size,
    bestMatch: chart[best.index].size,
    alternatives: byCloseness.slice(1, 3).map(({ row }) => row.size),
    confidence,
    notes,
  };
}
