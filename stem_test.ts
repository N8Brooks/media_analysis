import { stem } from "./stem.ts";
import { assertStrictEquals } from "./test_deps.ts";

const input = (await Deno.readTextFileSync("testdata/snowball_input.txt"))
  .split("\n");
const output = (await Deno.readTextFileSync("testdata/snowball_output.txt"))
  .split("\n");

for (let i = 0; i < input.length; i++) {
  const actual = stem(input[i]);
  const expected = output[i];
  assertStrictEquals(actual, expected);
}
