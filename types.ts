/** Contains `x` feature vector and binary class `y` */
export interface Sample {
  /** Training features */
  x: Set<number>;

  /** Target value */
  y: -1 | 1;

  /** Weight applied to sample */
  weight: number;
}

/** Classes for binary classification */
export type Prediction = -1 | 1;
