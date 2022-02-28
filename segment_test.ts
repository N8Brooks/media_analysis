import { segment } from "./segment.ts";
import { assertEquals } from "./test_deps.ts";

[
  { input: "\r\n", expected: ["\r\n"] },
  { input: "c.d.", expected: ["c.d."] },
  { input: "3.4", expected: ["3.4"] },
  { input: "U.S.", expected: ["U.S."] },
  { input: "the resp. leaders are", expected: ["the resp. leaders are"] },
  { input: "etc.)’ ‘(the ", expected: ["etc.)’ ‘(the "] },
  {
    input: "She said “See spot run.” John shook his head.",
    expected: ["She said “See spot run.” ", "John shook his head."],
  },
  { input: "etc. 它们指", expected: ["etc. ", "它们指"] },
  { input: "理数字. 它们指", expected: ["理数字. ", "它们指"] },
  { input: 'asdf."     Adf', expected: ['asdf."     ', "Adf"] },
  { input: "some ... ellipses", expected: ["some ... ellipses"] },
].forEach(({ input, expected }) => {
  Deno.test(input, () => {
    const actual = segment(input);
    assertEquals(actual, expected);
  });
});
