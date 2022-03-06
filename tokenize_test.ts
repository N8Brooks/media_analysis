// import { assertEquals } from "https://deno.land/std@0.127.0/testing/asserts.ts";
// import { tokenize } from "./tokenize.ts";

// [
//   {
//     input: '"starting quotes',
//     expected: "`` starting quotes",
//   },
//   {
//     input: 'middle " quotes',
//     expected: "middle `` quotes",
//   },
//   {
//     input: 'ending quotes"',
//     expected: "ending quotes ''",
//   },
//   {
//     input: 'bracket quotes ["',
//     expected: "bracket quotes [ ``",
//   },
//   {
//     input: "elli...pses ...",
//     expected: "elli ... pses ...",
//   },
//   {
//     input: ",;:@#$%&",
//     expected: ", ; : @ # $ % &",
//   },
//   {
//     input: "X.F.D.y corp",
//     expected: "X.F.D.y corp",
//   },
//   {
//     input: "We call him Mr. Dr. Ferdinand.",
//     expected: "We call him Mr. Dr. Ferdinand .",
//   },
//   {
//     input: "I'm 100.00% sure this wo 'nt split",
//     expected: "I 'm 100.00 % sure this wo 'nt split",
//   },
//   {
//     input: "()[]{}<>",
//     expected: "( ) [ ] { } < >",
//   },
//   {
//     input: "Chocolate--covered",
//     expected: "Chocolate -- covered",
//   },
//   {
//     input: "He said something along the lines of: 'That's the sailors ' ship'",
//     expected:
//       "He said something along the lines of : 'That 's the sailors ' ship'",
//   },
//   {
//     input: "It's I'm we'd",
//     expected: "It 's I 'm we 'd",
//   },
//   {
//     input: "They'll they're you've haven't",
//     expected: "They 'll they 're you 've have n't",
//   },
//   {
//     input: "THEY'LL THEY'RE YOU'VE HAVEN'T",
//     expected: "THEY 'LL THEY 'RE YOU 'VE HAVE N'T",
//   },
//   {
//     input: "cannot d'ye gimme gonna gotta lemme more'n tis twas wanna",
//     expected:
//       "can not d' ye gim me gon na got ta lem me more 'n 't is 't was wan na",
//   },
//   {
//     input: "Cannot D'ye Gimme Gonna Gotta Lemme More'n Tis Twas Wanna",
//     expected:
//       "Can not D' ye Gim me Gon na Got ta Lem me More 'n 'T is 'T was Wan na",
//   },
// ].forEach(({ input, expected }) => {
//   Deno.test(input.slice(0, 32), () => {
//     const actual = tokenize(input).join(" ");
//     assertEquals(actual, expected);
//   });
// });
