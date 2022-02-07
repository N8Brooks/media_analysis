/** This is just to test out the model on various texts */

import * as classifier from "./binary_classifier.ts";
import { N_FEATURES, vectorize } from "./vectorize.ts";

// TODO: Not sure why the .., 0, N_FEATURES) is required

const societyModel = await Deno.readFile("models/society_model.bin");
const societyWeights = new Float32Array(societyModel.buffer, 0, N_FEATURES);

const economyModel = await Deno.readFile("models/economy_model.bin");
const economyWeights = new Float32Array(economyModel.buffer, 0, N_FEATURES);

while (true) {
  const text = prompt() ?? "";
  const x = vectorize(text);
  const societyProbability = classifier.probability(x, societyWeights);
  const economyProbability = classifier.probability(x, economyWeights);
  console.log([societyProbability, economyProbability]);
}
