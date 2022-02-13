// https://arxiv.org/pdf/1107.2490v2.pdf

import { dLoss, loss } from "./loss.ts";
import { LOG_PRECISION } from "./constants.ts";
import { shuffle } from "./shuffle.ts";
import { Prediction, Sample } from "./types.ts";
import { N_FEATURES } from "./constants.ts";

/** Number of passes over the training samples */
const EPOCHS = 16;

/** Multiplies the regularization term */
const L2_COEFFICIENT = 1e-6;

/** The rate used for the constant learning rate schedule */
const LEARNING_RATE = 1e-3;

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
        p += u[i];
      });
      p /= alpha;

      // Not part of the algorithm - used for monitoring training
      sumLoss += loss(p, y);

      // α[t] = α[t - 1] / (1 - λ * γ[t])
      alpha /= 1 - L2_COEFFICIENT * LEARNING_RATE * weight;

      // β[t] = β[t - 1] / (1 - η[t])
      beta++;

      // g[t] = L[s](p, y[t])
      // Since these are using binary feature vectors no vector multiplication is necessary
      const g = dLoss(p, y);

      // u[t] = u[t - 1] - α[t] * γ[t] * g[t]
      // u_hat[t] = u_hat[t - 1] + α[t] * τ * γ[t] * g[t]
      x.forEach((i) => {
        u[i] -= g * alpha * LEARNING_RATE * weight;

        uHat[i] += g * alpha * tau * LEARNING_RATE * weight;
      });

      // τ[t] = τ[t - 1] + η[t] * β[t] / α[t]
      const rateOfAveraging = 1 / beta; // implied
      tau += rateOfAveraging * beta / alpha;
    }

    console.table({ alpha, beta, tau });

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
  // Using `alpha = 1` and `tau = beta`
  let beta = 0; // β[0] - samples processed

  // Copy weights for out-of-place update
  const u = weights.slice(); // u[0]
  const uHat = weights.slice(); // u_hat[0]

  let sumLoss = 0;

  for (const { x, y, weight } of samples) {
    // (1 / α[t - 1] * u[t - 1]^T * x[t])
    let p = 0;
    x.forEach((i) => {
      p += u[i];
    });

    // Not part of the algorithm - used for monitoring training
    sumLoss += loss(p, y);

    // β[t] = β[t - 1] / (1 - η[t])
    beta++;

    // g[t] = L[s](p, y[t])
    // Since these are using binary feature vectors no vector multiplication is necessary
    const g = dLoss(p, y);

    // u[t] = u[t - 1] - α[t] * γ[t] * g[t]
    // u_hat[t] = u_hat[t - 1] + α[t] * τ * γ[t] * g[t]
    x.forEach((i) => {
      u[i] -= g * LEARNING_RATE * weight;

      uHat[i] += g * beta * LEARNING_RATE * weight;
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
    prob += weights[i];
  });
  return prob;
};
