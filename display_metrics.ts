import * as classifier from "./binary_classifier.ts";
import { LOG_PRECISION } from "./constants.ts";
import { Sample } from "./sample.ts";

/** Used for metrics */
export interface SensitivityAndSpecificity {
  truePositives: number;
  trueNegatives: number;
  falsePositives: number;
  falseNegatives: number;
}

/** Calculates sensitivity and specificity counts */
export const computeSensitivityAndSpecificity = (
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

/** Returns an object organizing sensitivity and specificity*/
export const confusionMatrix = ({
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
export const assortedMetrics = ({
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
  return {
    accuracy: +accuracy.toFixed(LOG_PRECISION),
    precision: +precision.toFixed(LOG_PRECISION),
    recall: +recall.toFixed(LOG_PRECISION),
    f1Score: +f1Score.toFixed(LOG_PRECISION),
  };
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
