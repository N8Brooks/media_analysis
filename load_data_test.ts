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
  const expectedX = new Set([
    232231,
    247343,
  ]);
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
    121534,
    147817,
    164116,
    198032,
    210964,
    219679,
    221560,
    22270,
    22531,
    261037,
    46353,
    60975,
    67362,
    83342,
    86216,
  ]);
  assertEquals(actual.x, expectedX);
  const expectedY = -1;
  assertStrictEquals(actual.y, expectedY);
  assertStrictEquals(economyTest.length, 50);
});

Deno.test("load society train", async () => {
  const societyTrain = await loadData("datasets/society_train.csv");
  const actual = societyTrain[6137];
  const expectedWeight = 1.4694258016405668;
  const weightDiff = Math.abs(actual.weight - expectedWeight);
  assert(weightDiff < TOLERANCE);
  const expectedX = new Set([
    114268,
    137691,
    14201,
    144659,
    147340,
    150042,
    152588,
    154746,
    157063,
    157767,
    166307,
    185958,
    189894,
    199107,
    202415,
    208995,
    21719,
    220043,
    22218,
    226399,
    228212,
    228245,
    231159,
    250729,
    261764,
    33186,
    38356,
    49893,
    50476,
    72745,
    75725,
    79266,
    88248,
    95007,
    97656,
    98358,
  ]);
  assertEquals(actual.x, expectedX);
  const expectedY = 1;
  assertStrictEquals(actual.y, expectedY);
  assertStrictEquals(societyTrain.length, 15764);
});

Deno.test("load society test", async () => {
  const societyTest = await loadData("datasets/society_test.csv");
  const actual = societyTest[38];
  const expectedWeight = 1;
  const weightDiff = Math.abs(actual.weight - expectedWeight);
  assert(weightDiff < TOLERANCE);
  const expectedX = new Set([
    100044,
    116796,
    127129,
    131098,
    144349,
    148481,
    179389,
    202138,
    204339,
    21398,
    228212,
    256769,
    258363,
    42855,
    67706,
    71389,
    79008,
    9671,
  ]);
  assertEquals(actual.x, expectedX);
  const expectedY = 1;
  assertStrictEquals(actual.y, expectedY);
  assertStrictEquals(societyTest.length, 68);
});
