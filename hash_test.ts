import { assertStrictEquals } from "./test_deps.ts";
import { hash } from "./hash.ts";

Deno.test("empty string", () => {
  assertStrictEquals(hash(""), 0);
});

Deno.test("a", () => {
  assertStrictEquals(hash("a"), 1009084850);
});

Deno.test("ab", () => {
  assertStrictEquals(hash("ab"), 2613040991);
});

Deno.test("abc", () => {
  assertStrictEquals(hash("abc"), 3017643002);
});

Deno.test("abcd", () => {
  assertStrictEquals(hash("abcd"), 1139631978);
});

Deno.test("Bi Gram", () => {
  assertStrictEquals(hash("Bi Gram"), 141450124);
});
