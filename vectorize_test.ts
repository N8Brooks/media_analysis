import { assertEquals, assertStrictEquals } from "./test_deps.ts";
import { N_FEATURES } from "./constants.ts";
import { preprocess, vectorize } from "./vectorize.ts";
import { murmurHash3 } from "./deps.ts";

/** Several accent unique and accent redundant letters */
const ACCENTUATED = "àßÇÐéFgîõü";

/** Words without collisions for `N_FEATURES` */
const WORDS = ["lorem", "ipsum", "dolor", "sit", "amet"];

// Deno.test("accents", () => {
//   const actual = stripAccents(ACCENTUATED);
//   const expected = "aßCÐeFgiou";
//   assertStrictEquals(actual, expected);
// });

Deno.test("preprocess", () => {
  const actual = preprocess(ACCENTUATED);
  const expected = "aßcðefgiou";
  assertStrictEquals(actual, expected);
});

Deno.test("no tokens", () => {
  const actual = vectorize("");
  const expected = new Set();
  assertEquals(actual, expected);
});

Deno.test("sentence", () => {
  const text = WORDS.join(" ");
  const actual = vectorize(text);
  const expected = new Set();
  WORDS.forEach((word) => {
    const i = murmurHash3(word) % N_FEATURES;
    expected.add(i);
  });
  assertEquals(actual, expected);
});
