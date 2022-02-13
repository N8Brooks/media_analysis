import {
  assert,
  assertEquals,
  assertStrictEquals,
  assertThrows,
} from "./test_deps.ts";
import {
  balanceClasses,
  getPseudoClass,
  loadData,
  parseRecord,
} from "./load_data.ts";
import { Prediction } from "./types.ts";

/** Maximum absolute difference to fail a test */
const TOLERANCE = 1e-8;

/** Statically typed sparse feature indices set */
const SET: Set<number> = new Set();

/** Statically typed negative binary class */
const NEGATIVE_ONE: Prediction = -1;

/** Statically typed positive binary class */
const POSITIVE_ONE: Prediction = 1;

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

Deno.test("load economy train", async () => {
  const economyTrain = await loadData("datasets/economy_train.csv");
  const actual = economyTrain[1337];
  const expectedWeight = 3.4276556776556775;
  const weightDiff = Math.abs(actual.weight - expectedWeight);
  assert(weightDiff < TOLERANCE);
  const expectedX = new Set([35623, 42571, 55225]);
  assertEquals(actual.x, expectedX);
  const expectedY = -1;
  assertStrictEquals(actual.y, expectedY);
  assertStrictEquals(economyTrain.length, 3743);
});

Deno.test("load economy test", async () => {
  const economyTest = await loadData("datasets/economy_test.csv");
  const actual = economyTest[2];
  const expectedWeight = 1;
  const weightDiff = Math.abs(actual.weight - expectedWeight);
  assert(weightDiff < TOLERANCE);
  const expectedX = new Set([
    45022,
    46353,
    50038,
    31044,
    45119,
    31052,
    13677,
    64076,
    35356,
    13708,
    33044,
    16083,
    8877,
    17806,
    1826,
    49096,
    38045,
    34070,
    39402,
    63879,
  ]);
  assertEquals(actual.x, expectedX);
  const expectedY = -1;
  assertStrictEquals(actual.y, expectedY);
  assertStrictEquals(economyTest.length, 50);
});

Deno.test("load society train", async () => {
  const societyTrain = await loadData("datasets/society_train.csv");
  const actual = societyTrain[6138];
  const expectedWeight = 1.459814814814815;
  const weightDiff = Math.abs(actual.weight - expectedWeight);
  assert(weightDiff < TOLERANCE);
  const expectedX = new Set([38525, 16083]);
  assertEquals(actual.x, expectedX);
  const expectedY = 1;
  assertStrictEquals(actual.y, expectedY);
  assertStrictEquals(societyTrain.length, 15766);
});

Deno.test("load society test", async () => {
  const societyTest = await loadData("datasets/society_test.csv");
  const actual = societyTest[38];
  const expectedWeight = 1;
  const weightDiff = Math.abs(actual.weight - expectedWeight);
  assert(weightDiff < TOLERANCE);
  const expectedX = new Set([
    61593,
    53424,
    52516,
    43099,
    26,
    20419,
    61755,
    57478,
    23005,
    40802,
    46342,
    40652,
    9671,
    5530,
    22014,
    5853,
    16083,
    40776,
    7731,
    53154,
    48317,
    42855,
    20780,
    31604,
    13677,
    36433,
    31618,
    8564,
    13472,
    60161,
    2170,
    51260,
  ]);
  assertEquals(actual.x, expectedX);
  const expectedY = 1;
  assertStrictEquals(actual.y, expectedY);
  assertStrictEquals(societyTest.length, 68);
});
