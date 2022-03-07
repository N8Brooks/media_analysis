/// <reference types="./segmenter.d.ts" />

/** Word segmenter instance */
const segmenter = new Intl.Segmenter("en", { granularity: "word" });

/** Corrects `Intl.Segmenter` word granularity for ellipses, acronyms, abbreviation on a preprocessed string */
export const tokenize = (sentence: string): string[] => {
  let space = true;
  const tokens: string[] = [];
  for (const { segment } of segmenter.segment(sentence)) {
    switch (segment) {
      case " ":
        space = true;
        break;
      case ".":
        if (space) {
          tokens.push(".");
        } else {
          tokens[tokens.length - 1] += ".";
        }
        space = false;
        break;
      default:
        tokens.push(segment);
        space = false;
    }
  }
  return tokens;
};
