import { preprocess } from "./preprocess.ts";
import { assertStrictEquals } from "./test_deps.ts";

/** Several accent unique and accent redundant letters */
const ACCENTUATED = "àßÇÐéFgîõü";

Deno.test("preprocess", () => {
  const actual = preprocess(ACCENTUATED);
  const expected = "aßcðefgiou";
  assertStrictEquals(actual, expected);
});
