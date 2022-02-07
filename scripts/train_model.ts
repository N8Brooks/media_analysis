import * as classifier from "../binary_classifier.ts";
import { parse } from "../deps.ts";
import { displayMetrics } from "../display_metrics.ts";
import { loadData } from "../load_data.ts";

const {
  /** Whether the model will be saved to disk */
  w,

  _, // used for axis name
} = parse(Deno.args);

/** Axis name used for datasets and model */
const axis = _[0];

if (axis !== "society" && axis != "economy") {
  console.error("Axis arg must be either 'economy' or 'society'");
  Deno.exit(0);
}

// Train model
console.log("Training on society axis dataset");
const train = await loadData(`datasets/${axis}_train.csv`);
const weights = classifier.fit(train);

// Test model
const test = await loadData(`datasets/${axis}_test.csv`);
displayMetrics(test, weights);

// Save model
if (w) {
  console.info("Saving model");
  const model = new Uint8Array(weights.buffer);
  await Deno.writeFile(`models/${axis}_model.bin`, model);
}
