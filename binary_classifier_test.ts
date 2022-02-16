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

/** First 10 expected classifier weights for fit */
const FIT_EXPECTED_WEIGHTS = [
  0.49234145879745483,
  0.49234145879745483,
  0.49234145879745483,
  0.443408340215683,
  0.443408340215683,
  0.443408340215683,
  0.443408340215683,
  0.5867238640785217,
  0.5867238640785217,
  0,
];

/** The average loss messages from fitting */
const FIT_EXPECTED_LOGS = [
  "Epoch 0 - Average loss: 1.0000",
  "Epoch 1 - Average loss: 0.4338",
  "Epoch 2 - Average loss: 0.1922",
  "Epoch 3 - Average loss: 0.0869",
  "Epoch 4 - Average loss: 0.0400",
  "Epoch 5 - Average loss: 0.0188",
  "Epoch 6 - Average loss: 0.0089",
  "Epoch 7 - Average loss: 0.0043",
  "Epoch 8 - Average loss: 0.0021",
  "Epoch 9 - Average loss: 0.0010",
  "Epoch 10 - Average loss: 0.0005",
  "Epoch 11 - Average loss: 0.0003",
  "Epoch 12 - Average loss: 0.0001",
  "Epoch 13 - Average loss: 0.0001",
  "Epoch 14 - Average loss: 0.0000",
  "Epoch 15 - Average loss: 0.0000",
];

Deno.test("fit", () => {
  const { logs: actualLogs, restore } = stubConsole("info");
  seed(0);
  const test: Sample[] = [
    { x: new Set([0, 1, 2]), y: 1, weight: 1 },
    { x: new Set([3, 4, 5, 6]), y: 1, weight: 1 },
    { x: new Set([7, 8]), y: 1, weight: 1 },
  ];
  const actual = classifier.fit(test);
  FIT_EXPECTED_WEIGHTS.forEach((expectedI, i) => {
    const absoluteDifference = Math.abs(actual[i] - expectedI);
    assert(absoluteDifference < TOLERANCE);
  });
  assertEquals(actualLogs, FIT_EXPECTED_LOGS);
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

Deno.test("predict negative", () => {
  assertStrictEquals(classifier.predict(-3), -1);
});

Deno.test("predict positive", () => {
  assertStrictEquals(classifier.predict(0.01), 1);
});

/** First 10 expected classifier weights for partial fit */
const PARTIAL_FIT_EXPECTED_WEIGHTS = [
  0,
  0,
  0,
  -0.06666667014360428,
  0,
  -0.06666667014360428,
  -0.13333334028720856,
  0,
  0,
  0,
];

/** Average loss over partial fit epoch */
const PARTIAL_FIT_EXPECTED_LOGS = [
  "Partial fit - Average loss: 1.0000",
];

Deno.test("partial fit", () => {
  const { logs: actualLogs, restore } = stubConsole("info");
  seed(0);
  const test: Sample[] = [
    { x: new Set([0, 2]), y: 1, weight: 1 },
    { x: new Set([3, 5]), y: 1, weight: 1 },
    { x: new Set([6]), y: 1, weight: 1 },
  ];
  const weights = new Float32Array(256);
  const actual = classifier.partialFit(test, weights);
  PARTIAL_FIT_EXPECTED_WEIGHTS.forEach((expectedI, i) => {
    const absoluteDifference = Math.abs(actual[i] - expectedI);
    assert(absoluteDifference < TOLERANCE);
  });
  assertEquals(actualLogs, PARTIAL_FIT_EXPECTED_LOGS);
  restore();
});
