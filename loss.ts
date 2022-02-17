/** Log loss for binary classification */
export const loss = (p: number, y: number): number => {
  const z = p * y;
  if (z > 18) {
    return Math.exp(-z);
  } else if (z < -18) {
    return -z;
  } else {
    return Math.log(1 + Math.exp(-z));
  }
};

/** Derivative log loss for binary classification */
export const dLoss = (p: number, y: number): number => {
  const z = p * y;
  if (z > 18) {
    return Math.exp(-z) * -y;
  } else if (z < -18) {
    return -y;
  } else {
    return -y / (1 + Math.exp(z));
  }
};
