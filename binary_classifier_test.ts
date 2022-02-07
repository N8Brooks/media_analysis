import * as classifier from "./binary_classifier.ts";
import {
  assert,
  assertEquals,
  assertStrictEquals,
  seed,
  stubConsole,
} from "./test_deps.ts";
import { Sample } from "./sample.ts";

/** Maximum absolute difference to fail a test */
const TOLERANCE = 1e-8;

/** The average loss messages from fitting */
const EXPECTED_LOGS = [
  "Epoch 0, Avg. loss: 1",
  "Epoch 1, Avg. loss: 0.9880359994811624",
  "Epoch 2, Avg. loss: 0.9762151368768758",
  "Epoch 3, Avg. loss: 0.9645357000068676",
  "Epoch 4, Avg. loss: 0.9529959946411285",
  "Epoch 5, Avg. loss: 0.94159435112378",
  "Epoch 6, Avg. loss: 0.9303291145845783",
  "Epoch 7, Avg. loss: 0.9191986555849092",
  "Epoch 8, Avg. loss: 0.9082013617390133",
  "Epoch 9, Avg. loss: 0.8973356375680224",
  "Epoch 10, Avg. loss: 0.8865999148780098",
  "Epoch 11, Avg. loss: 0.8759926366100932",
  "Epoch 12, Avg. loss: 0.865512262056411",
  "Epoch 13, Avg. loss: 0.8551572770543844",
  "Epoch 14, Avg. loss: 0.8449261729912455",
  "Epoch 15, Avg. loss: 0.8348174776106833",
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
  const { logs: actualLogs, restore } = stubConsole("log");
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
