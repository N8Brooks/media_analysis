import { assertEquals } from "./test_deps.ts";
import { hash } from "./hash.ts";
import { N_FEATURES, vectorize } from "./vectorize.ts";

/** Words without collisions for `N_FEATURES` */
const WORDS = ["lorem", "ipsum", "dolor", "sit", "amet"];

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
    const i = hash(word) % N_FEATURES;
    expected.add(i);
  });
  assertEquals(actual, expected);
});
