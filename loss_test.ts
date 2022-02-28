import { assert } from "./test_deps.ts";
import { dLoss, loss } from "./loss.ts";

/** Maximum absolute difference to fail a test */
const TOLERANCE = 1e-8;

Deno.test("loss greater than 1", () => {
  const actual = loss(1, 2);
  const expected = 0.1269280110429726;
  assert(Math.abs(actual - expected) < TOLERANCE);
});

Deno.test("loss between -1 and 1", () => {
  const actual = loss(1, 0.5);
  const expected = 0.4740769841801067;
  assert(Math.abs(actual - expected) < TOLERANCE);
});

Deno.test("loss less than -1", () => {
  const actual = loss(-1, 2);
  const expected = 2.1269280110429727;
  assert(Math.abs(actual - expected) < TOLERANCE);
});

Deno.test("derivative loss greater than 1", () => {
  const actual = dLoss(1, 2);
  const expected = -0.2384058440442351;
  assert(Math.abs(actual - expected) < TOLERANCE);
});

Deno.test("derivative loss between -1 and 1", () => {
  const actual = dLoss(1, 0.5);
  const expected = -0.1887703343990727;
  assert(Math.abs(actual - expected) < TOLERANCE);
});

Deno.test("derivative loss less than -1", () => {
  const actual = dLoss(-1, 2);
  const expected = -1.7615941559557646;
  assert(Math.abs(actual - expected) < TOLERANCE);
});
