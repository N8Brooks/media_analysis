import * as classifier from "./binary_classifier.ts";
import {
  assert,
  assertEquals,
  assertStrictEquals,
  seed,
  stubConsole,
} from "./test_deps.ts";
import { Sample } from "./types.ts";

/** Maximum absolute difference to fail a test */
const TOLERANCE = 1e-8;

/** The average loss messages from fitting */
const EXPECTED_LOGS = [
  "Epoch 0 - Average loss: 1.0000",
  "Epoch 1 - Average loss: 0.9880",
  "Epoch 2 - Average loss: 0.9762",
  "Epoch 3 - Average loss: 0.9645",
  "Epoch 4 - Average loss: 0.9530",
  "Epoch 5 - Average loss: 0.9416",
  "Epoch 6 - Average loss: 0.9303",
  "Epoch 7 - Average loss: 0.9192",
  "Epoch 8 - Average loss: 0.9082",
  "Epoch 9 - Average loss: 0.8973",
  "Epoch 10 - Average loss: 0.8866",
  "Epoch 11 - Average loss: 0.8760",
  "Epoch 12 - Average loss: 0.8655",
  "Epoch 13 - Average loss: 0.8552",
  "Epoch 14 - Average loss: 0.8449",
  "Epoch 15 - Average loss: 0.8348",
];

/** First 10 expected classifier weights */
const EXPECTED_WEIGHTS = [
  0.015860844403505325,
  0.015860844403505325,
  0.015860844403505325,
  0.015741802752017975,
  0.015741802752017975,
  0.015741802752017975,
  0.015986517071723938,
  0.015986517071723938,
  0.015986517071723938,
  0,
];

Deno.test("fit", () => {
  const { logs: actualLogs, restore } = stubConsole("info");
  seed(0);
  const test: Sample[] = [
    { x: new Set([0, 1, 2]), y: 1, weight: 1 },
    { x: new Set([3, 4, 5]), y: 1, weight: 1 },
    { x: new Set([6, 7, 8]), y: 1, weight: 1 },
  ];
  const actual = classifier.fit(test);
  EXPECTED_WEIGHTS.forEach((expectedI, i) => {
    const absoluteDifference = Math.abs(actual[i] - expectedI);
    assert(absoluteDifference < TOLERANCE);
  });
  assertEquals(actualLogs, EXPECTED_LOGS);
  restore();
});

Deno.test("probability", () => {
  const x = new Set([133, 138, 208]);
  const weights = new Float32Array(256);
  weights.fill(0.1);
  const actual = classifier.probability(x, weights);
  const expected = 0.3;
  assert(Math.abs(actual - expected) < TOLERANCE);
});

Deno.test("predict", () => {
  const x = new Set([133, 138, 208]);
  const weights = new Float32Array(256);
  weights.fill(0.1);
  const actual = classifier.predict(x, weights);
  const expected = 1;
  assertStrictEquals(actual, expected);
});
