// https://en.wikipedia.org/wiki/Huber_loss#Variant_for_classification

/** Modified Huber loss for binary classification */
export const loss = (p: number, y: number): number => {
  const z = p * y;
  if (z >= 1) {
    return 0;
  } else if (z >= -1) {
    return (1 - z) * (1 - z);
  } else {
    return -4 * z;
  }
};

/** Derivative Modified Huber loss for binary classification */
export const dLoss = (p: number, y: number): number => {
  const z = p * y;
  if (z >= 1) {
    return 0;
  } else if (z >= -1) {
    return 2 * (1 - z) * -y;
  } else {
    return -4 * y;
  }
};
