import { assertStrictEquals } from "./test_deps.ts";
import { dLoss, loss } from "./loss.ts";

Deno.test("loss greater than 1", () => {
  assertStrictEquals(loss(1, 2), 0);
});

Deno.test("loss between -1 and 1", () => {
  assertStrictEquals(loss(1, 0.5), 0.25);
});

Deno.test("loss less than -1", () => {
  assertStrictEquals(loss(-1, 2), 8);
});

Deno.test("derivative loss greater than 1", () => {
  assertStrictEquals(dLoss(1, 2), 0);
});

Deno.test("derivative loss between -1 and 1", () => {
  assertStrictEquals(dLoss(1, 0.5), -0.5);
});

Deno.test("derivative loss less than -1", () => {
  assertStrictEquals(dLoss(-1, 2), -8);
});
