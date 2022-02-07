import * as classifier from "./binary_classifier.ts";
import { Sample } from "./sample.ts";

/** Used for metrics */
interface SensitivityAndSpecificity {
  truePositives: number;
  trueNegatives: number;
  falsePositives: number;
  falseNegatives: number;
}

/** Calculates sensitivity and specificity counts */
const computeSensitivityAndSpecificity = (
  samples: Sample[],
  weights: Float32Array,
): SensitivityAndSpecificity => {
  let truePositives = 0;
  let trueNegatives = 0;
  let falsePositives = 0;
  let falseNegatives = 0;

  samples.forEach((sample) => {
    const yTrue = sample.y;
    const yPred = classifier.predict(sample.x, weights);
    if (yTrue === 1 && yPred === 1) {
      truePositives++;
    } else if (yTrue === -1 && yPred === -1) {
      trueNegatives++;
    } else if (yTrue === 1 && yPred === -1) {
      falsePositives++;
    } else if (yTrue === -1 && yPred === 1) {
      falseNegatives++;
    } else {
      console.warn(`Encountered an invalid  yTrue=${yTrue} and yPred=${yPred}`);
    }
  });

  return {
    truePositives,
    trueNegatives,
    falsePositives,
    falseNegatives,
  };
};

/** Returns an object organizing sensitivity and specificity */
const confusionMatrix = ({
  truePositives,
  trueNegatives,
  falsePositives,
  falseNegatives,
}: SensitivityAndSpecificity) => {
  return {
    "Predicted Positive": {
      "True Positive": truePositives,
      "True Negative": falsePositives,
    },
    "Predicted Negative": {
      "True Positive": falseNegatives,
      "True Negative": trueNegatives,
    },
  };
};

/** Returns an object with various metrics */
const assortedMetrics = ({
  truePositives,
  trueNegatives,
  falsePositives,
  falseNegatives,
}: SensitivityAndSpecificity) => {
  const n = truePositives + trueNegatives + falsePositives + falseNegatives;
  const accuracy = (truePositives + trueNegatives) / n;
  const precision = truePositives / (truePositives + falsePositives);
  const recall = truePositives / (truePositives + falseNegatives);
  const f1Score = 2 * precision * recall / (precision + recall);
  return { accuracy, precision, recall, f1Score };
};

/** Displays assorted metrics from the given test data */
export const displayMetrics = (
  samples: Sample[],
  weights: Float32Array,
): void => {
  const sensitivityAndSpecificity = computeSensitivityAndSpecificity(
    samples,
    weights,
  );
  console.table(confusionMatrix(sensitivityAndSpecificity));
  console.table(assortedMetrics(sensitivityAndSpecificity));
};
