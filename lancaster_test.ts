import { stem } from "./lancaster.ts";
import { assertStrictEquals } from "./test_deps.ts";

Deno.test("maximum", () => {
  assertStrictEquals(stem("maximum"), "maxim");
});

Deno.test("presumably", () => {
  assertStrictEquals(stem("presumably"), "presum");
});

Deno.test("multiply", () => {
  assertStrictEquals(stem("multiply"), "multiply");
});

Deno.test("provision", () => {
  assertStrictEquals(stem("provision"), "provid");
});

Deno.test("owed", () => {
  assertStrictEquals(stem("owed"), "ow");
});

Deno.test("ear", () => {
  assertStrictEquals(stem("ear"), "ear");
});

Deno.test("saying", () => {
  assertStrictEquals(stem("saying"), "say");
});

Deno.test("crying", () => {
  assertStrictEquals(stem("crying"), "cry");
});

Deno.test("string", () => {
  assertStrictEquals(stem("string"), "string");
});

Deno.test("meant", () => {
  assertStrictEquals(stem("meant"), "meant");
});

Deno.test("cement", () => {
  assertStrictEquals(stem("cement"), "cem");
});
