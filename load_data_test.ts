import { assertEquals, assertStrictEquals, assertThrows } from "./test_deps.ts";
import { balanceClasses, getPseudoClass, parseRecord } from "./load_data.ts";

/** Statically typed sparse feature indices set */
const SET: Set<number> = new Set();

/** Statically typed negative binary class */
const NEGATIVE_ONE: (-1 | 1) = -1;

/** Statically typed positive binary class */
const POSITIVE_ONE: (-1 | 1) = 1;

Deno.test("invalid row", () => {
  assertThrows(() => parseRecord({ target: "0" }));
});

Deno.test("valid row", () => {
  const { x, y, weight, ...rest } = parseRecord({
    target: "-1",
    question: "8",
    text: "text",
  });
  assertStrictEquals(x.size, 1);
  assertStrictEquals(y, -1);
  assertStrictEquals(weight, 8);
  assertEquals(rest, {});
});

Deno.test("pseudo class", () => {
  // Weight is temporarily assigned to question number
  const sample = {
    x: SET,
    y: POSITIVE_ONE,
    weight: 4,
  };
  const actual = getPseudoClass(sample);
  const expected = `${sample.y},${sample.weight}`;
  assertStrictEquals(actual, expected);
});

Deno.test("balance classes", () => {
  const data = [
    { x: SET, y: NEGATIVE_ONE, weight: 0 },
    { x: SET, y: NEGATIVE_ONE, weight: 1 },
    { x: SET, y: NEGATIVE_ONE, weight: 2 },
    { x: SET, y: POSITIVE_ONE, weight: 0 },
    { x: SET, y: POSITIVE_ONE, weight: 0 },
    { x: SET, y: POSITIVE_ONE, weight: 1 },
    { x: SET, y: POSITIVE_ONE, weight: 2 },
  ];
  const actual = balanceClasses(data);
  const expected = [
    { x: SET, y: NEGATIVE_ONE, weight: 7 / 6 },
    { x: SET, y: NEGATIVE_ONE, weight: 7 / 6 },
    { x: SET, y: NEGATIVE_ONE, weight: 7 / 6 },
    { x: SET, y: POSITIVE_ONE, weight: 7 / 12 },
    { x: SET, y: POSITIVE_ONE, weight: 7 / 12 },
    { x: SET, y: POSITIVE_ONE, weight: 7 / 6 },
    { x: SET, y: POSITIVE_ONE, weight: 7 / 6 },
  ];
  assertEquals(actual, expected);
});
