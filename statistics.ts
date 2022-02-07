/** Degrees of freedom and t distribution values for the given alpha */
const T_DISTRIBUTION_TABLE = [
  { i: 0, 0.2: NaN, 0.05: NaN },
  { i: 1, 0.2: 3.078, 0.05: 12.71 },
  { i: 2, 0.2: 1.886, 0.05: 4.303 },
  { i: 3, 0.2: 1.638, 0.05: 3.182 },
  { i: 4, 0.2: 1.533, 0.05: 2.776 },
  { i: 5, 0.2: 1.476, 0.05: 2.571 },
  { i: 6, 0.2: 1.440, 0.05: 2.447 },
  { i: 7, 0.2: 1.415, 0.05: 2.365 },
  { i: 8, 0.2: 1.397, 0.05: 2.306 },
  { i: 9, 0.2: 1.383, 0.05: 2.262 },
  { i: 10, 0.2: 1.372, 0.05: 2.228 },
  { i: 11, 0.2: 1.363, 0.05: 2.201 },
  { i: 12, 0.2: 1.356, 0.05: 2.179 },
  { i: 13, 0.2: 1.350, 0.05: 2.160 },
  { i: 14, 0.2: 1.345, 0.05: 2.145 },
  { i: 15, 0.2: 1.341, 0.05: 2.131 },
  { i: 16, 0.2: 1.337, 0.05: 2.120 },
  { i: 17, 0.2: 1.333, 0.05: 2.110 },
  { i: 18, 0.2: 1.330, 0.05: 2.101 },
  { i: 19, 0.2: 1.328, 0.05: 2.093 },
  { i: 20, 0.2: 1.325, 0.05: 2.086 },
  { i: 21, 0.2: 1.323, 0.05: 2.080 },
  { i: 22, 0.2: 1.321, 0.05: 2.074 },
  { i: 23, 0.2: 1.319, 0.05: 2.069 },
  { i: 24, 0.2: 1.318, 0.05: 2.064 },
  { i: 25, 0.2: 1.316, 0.05: 2.060 },
  { i: 26, 0.2: 1.315, 0.05: 2.056 },
  { i: 27, 0.2: 1.314, 0.05: 2.052 },
  { i: 28, 0.2: 1.313, 0.05: 2.048 },
  { i: 29, 0.2: 1.311, 0.05: 2.045 },
  { i: 30, 0.2: 1.310, 0.05: 2.042 },
  { i: 40, 0.2: 1.303, 0.05: 2.021 },
  { i: 60, 0.2: 1.296, 0.05: 2.000 },
  { i: 80, 0.2: 1.292, 0.05: 1.990 },
  { i: 100, 0.2: 1.290, 0.05: 1.984 },
  { i: 1000, 0.2: 1.282, 0.05: 1.962 },
];

/** Return the t distribution value for `degreesOfFreedom` */
const tLookup = (degreesOfFreedom: number) => {
  // Leftmost binary search
  let l = 0;
  let r = T_DISTRIBUTION_TABLE.length;
  while (l < r) {
    const m = Math.floor((l + r) / 2);
    const index = T_DISTRIBUTION_TABLE[m].i;
    if (index < degreesOfFreedom) {
      l = m + 1;
    } else {
      r = m;
    }
  }
  return T_DISTRIBUTION_TABLE[l];
};

export const mean = (samples: number[]): number => {
  return samples.reduce((a, b) => a + b) / samples.length;
};

/** Standard deviation for a sample */
export const std = (samples: number[]) => {
  const sampleMean = mean(samples);
  const sumSquaredError = samples.reduce((sum, sample) => {
    const error = sample - sampleMean;
    const squaredError = error * error;
    return sum + squaredError;
  }, 0);
  const variance = sumSquaredError / (samples.length - 1);
  return variance ** 0.5;
};

/** The t distribution margin of error for the given alpha */
export const marginOfError = (samples: number[], alpha: 0.2 | 0.05) => {
  const degreesOfFreedom = samples.length - 1;
  const tStatistic = tLookup(degreesOfFreedom)[alpha];
  const standardError = std(samples) / samples.length ** 0.5;
  const marginOfError = tStatistic * standardError;
  return marginOfError;
};
