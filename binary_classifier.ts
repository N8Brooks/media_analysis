// https://arxiv.org/pdf/1107.2490v2.pdf

import { dLoss, loss } from "./loss.ts";
import { LOG_PRECISION } from "./constants.ts";
import { shuffle } from "./shuffle.ts";
import { Prediction, Sample } from "./types.ts";
import { N_FEATURES } from "./constants.ts";

/** Number of passes over the training samples */
const EPOCHS = 48;

/** Multiplies the regularization term, sklearn's alpha */
const L2_COEFFICIENT = 1e-4;

/** Element of an l2 normalized binary vector */
export const l2Norm = (n: number): number => {
  return n ** 0.5 / n;
};

/** Alternate sign for a given index */
export const alternateSign = (i: number): number => {
  return 2 * (i & 1) - 1;
};

/** Sparse binary ASGD classifier fitting function */
export const fit = (samples: Sample[]): Float32Array => {
  let alpha = 1; // α[0]
  let beta = 0; // β[0] - samples processed
  let tau = 0; // τ[0]

  const u = new Float32Array(N_FEATURES); // u[0]
  const uHat = new Float32Array(N_FEATURES); // u_hat[0]

  for (let epoch = 0; epoch < EPOCHS; epoch++) {
    shuffle(samples);

    let sumLoss = 0;

    for (const { x, y, weight } of samples) {
      // (1 / α[t - 1] * u[t - 1]^T * x[t])
      let p = 0;
      x.forEach((i) => {
        p += u[i] * alternateSign(i);
      });
      p *= l2Norm(x.size) / alpha;

      // Not part of the algorithm - used for monitoring training
      sumLoss += loss(p, y);

      // β[t] = β[t - 1] / (1 - η[t])
      beta++;

      // approximate optimal learning rate
      const learningRate = 1 / (L2_COEFFICIENT * beta);

      // α[t] = α[t - 1] / (1 - λ * γ[t])
      alpha /= 1 - L2_COEFFICIENT * learningRate * weight;

      // g[t] = L[s](p, y[t])
      // Since these are using binary feature vectors no vector multiplication is necessary
      const g = dLoss(p, y);

      // u[t] = u[t - 1] - α[t] * γ[t] * g[t]
      // u_hat[t] = u_hat[t - 1] + α[t] * τ * γ[t] * g[t]
      const constant = g * alpha * learningRate * weight;
      x.forEach((i) => {
        const sign = alternateSign(i);
        u[i] -= constant * sign;
        uHat[i] += constant * tau * sign;
      });

      // τ[t] = τ[t - 1] + η[t] * β[t] / α[t]
      const rateOfAveraging = 1 / beta; // implied
      tau += rateOfAveraging * beta / alpha;
    }

    const averageLoss = (sumLoss / samples.length).toFixed(LOG_PRECISION);
    console.info(`Epoch ${epoch} - Average loss: ${averageLoss}`);
  }

  // θ_mean[t] = u_hat[t] / β[t] = (τ[t] * u[t] + u_hat[t]) / βt
  return u.map((weight, i) => (tau * weight + uHat[i]) / beta);
};

/** Perform one epoch of ASGD out-of-place with a constant rate of averaging */
export const partialFit = (
  samples: Sample[],
  weights: Float32Array,
): Float32Array => {
  // Using `alpha = 1` and `tau = beta`, and `learningRate = 1`
  let beta = 0; // β[0] - samples processed

  // Copy weights for out-of-place update
  const u = weights.slice(); // u[0]
  const uHat = weights.slice(); // u_hat[0]

  let sumLoss = 0;

  for (const { x, y, weight } of samples) {
    // (1 / α[t - 1] * u[t - 1]^T * x[t])
    let p = 0;
    x.forEach((i) => {
      p += u[i] * alternateSign(i);
    });
    p *= l2Norm(x.size);

    // Not part of the algorithm - used for monitoring training
    sumLoss += loss(p, y);

    // β[t] = β[t - 1] / (1 - η[t])
    beta++;

    // g[t] = L[s](p, y[t])
    // Since these are using binary feature vectors no vector multiplication is necessary
    const g = dLoss(p, y);

    // u[t] = u[t - 1] - α[t] * γ[t] * g[t]
    // u_hat[t] = u_hat[t - 1] + α[t] * τ * γ[t] * g[t]
    const constant = g * weight;
    x.forEach((i) => {
      const sign = alternateSign(i);
      u[i] -= constant * sign;
      uHat[i] += constant * beta * sign;
    });
  }

  const averageLoss = (sumLoss / samples.length).toFixed(LOG_PRECISION);
  console.info(`Partial fit - Average loss: ${averageLoss}`);

  // θ_mean[t] = u_hat[t] / β[t] = (τ[t] * u[t] + u_hat[t]) / βt
  return u.map((weight, i) => (weight + uHat[i]) / beta);
};

/** Convert a probability to a prediction */
export function predict(probability: number): Prediction;

/** ASGD classifier prediction function for sparse binary feature vector, `x` */
export function predict(x: Set<number>, weights: Float32Array): Prediction;

export function predict(
  x: Set<number> | number,
  weights?: Float32Array,
): Prediction {
  if (typeof x === "number") {
    return x > 0 ? 1 : -1;
  } else if (x instanceof Set && weights) {
    return probability(x, weights) > 0 ? 1 : -1;
  } else {
    throw new RangeError(`Invalid types for predict: ${x}, ${weights}`);
  }
}

/** Probability estimate-ish for sparse binary feature vector, `x` */
export const probability = (x: Set<number>, weights: Float32Array): number => {
  let prob = 0;
  x.forEach((i) => {
    prob += weights[i] * alternateSign(i);
  });
  return Math.max(-1, Math.min(1, l2Norm(x.size) * prob));
};
