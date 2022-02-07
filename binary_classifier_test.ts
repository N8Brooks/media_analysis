import * as classifier from "./binary_classifier.ts";
import { assert, assertStrictEquals, seed } from "./test_deps.ts";
import { Sample } from "./sample.ts";

/** Maximum absolute difference to fail a test */
const TOLERANCE = 1e-8;

Deno.test("fit", () => {
  seed(0);
  const test: Sample[] = [
    { x: new Set([0, 1, 2]), y: 1, weight: 1 },
    { x: new Set([3, 4, 5]), y: 1, weight: 1 },
    { x: new Set([6, 7, 8]), y: 1, weight: 1 },
  ];
  const actual = classifier.fit(test);
  [
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
  ].forEach((expectedI, i) => {
    const absoluteDifference = Math.abs(actual[i] - expectedI);
    assert(absoluteDifference < TOLERANCE);
  });
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
