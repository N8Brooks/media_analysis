import {
  assert,
  assertEquals,
  assertStrictEquals,
  assertThrows,
} from "./test_deps.ts";
import { marginOfError, mean, std, tLookup } from "./statistics.ts";

/** Maximum absolute difference to fail a test */
const TOLERANCE = 1e-8;

Deno.test("start t lookup", () => {
  const actual = tLookup(-1);
  const expected = {
    "0.05": 10,
    "0.2": 10,
    i: 0,
  };
  assertEquals(actual, expected);
});

Deno.test("exact t lookup", () => {
  const actual = tLookup(63);
  const expected = {
    "0.05": 1.99,
    "0.2": 1.292,
    i: 80,
  };
  assertEquals(actual, expected);
});

Deno.test("middle t lookup", () => {
});

Deno.test("end t lookup", () => {
  const actual = tLookup(10_000);
  const expected = {
    "0.05": 1.962,
    "0.2": 1.282,
    i: 1000,
  };
  assertEquals(actual, expected);
});

Deno.test("mean of 0", () => {
  assertStrictEquals(mean([0]), 0);
});

Deno.test("mean of 0.5", () => {
  assertStrictEquals(mean([0, 1]), 0.5);
});

Deno.test("mean of 3", () => {
  assertStrictEquals(mean([2, 4]), 3);
});

Deno.test("std with 1", () => {
  assertStrictEquals(mean([1]), 1);
});

Deno.test("std of 0", () => {
  assertStrictEquals(std([2, 2, 2]), 0);
});

Deno.test("std of 0.5", () => {
  assertStrictEquals(std([0.25, 0.5, 0.75]), 0.25);
});

Deno.test("std of 1", () => {
  assertStrictEquals(std([2, 3, 4]), 1);
});

Deno.test("moe of 1-ish", () => {
  const actual = marginOfError([1, 2, 3], 0.2);
  const expected = 1.0888826076916343;
  const diff = Math.abs(actual - expected);
  assert(diff < TOLERANCE);
});

Deno.test("moe of 10-ish", () => {
  const actual = marginOfError([1, 2.5], 0.05);
  const expected = 9.532499999999999;
  const diff = Math.abs(actual - expected);
  assert(diff < TOLERANCE);
});
