import { assertEquals, assertNotEquals, seed } from "./test_deps.ts";
import { shuffle } from "./shuffle.ts";

Deno.test("empty array", () => {
  const array: unknown[] = [];
  shuffle(array);
  assertEquals(array, []);
});

Deno.test("hi", () => {
  shuffle([]);
});

Deno.test("medium array", () => {
  seed(0);
  const actual = Array.from({ length: 10 }, (_, i) => i);
  shuffle(actual);
  const expected = [5, 7, 6, 1, 4, 3, 8, 0, 9, 2];
  assertEquals(actual, expected);
});

Deno.test("large array", () => {
  const array = Array.from({ length: 100 }, (_, i) => i);
  shuffle(array);

  // About a 1 in 9.3e157 chance of a false positive
  const notExpectedOrder = Array.from({ length: 100 }, (_, i) => i);
  assertNotEquals(array, notExpectedOrder);

  const actualContents = new Set(array);
  const expectedContents = new Set(notExpectedOrder);
  assertEquals(actualContents, expectedContents);
});
