// https://en.wikipedia.org/wiki/Feature_hashing

import { N_FEATURES } from "./constants.ts";
import { murmurHash3, stemmer } from "./deps.ts";
import { STOP_WORDS } from "./stop_words.ts";
import { tokenize } from "./tokenize.ts";

/** Matches underscores, digits and diacritics */
const TRANSFORM = /[_\p{Diacritic}]/gu;

/** Lower cases, removes accents, joins split words, and replaces underscores with spaces */
export const preprocess = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(TRANSFORM, (char) => char === "_" ? " " : "");
};

/** Sparse indices of a text's uncased, hashed monograms with no stop words */
export const vectorize = (text: string): Set<number> => {
  const indices: Set<number> = new Set();
  for (const token of tokenize(preprocess(text))) {
    if (token in STOP_WORDS) {
      continue;
    }
    const base = stemmer.stem(token);
    const i = murmurHash3(base) % N_FEATURES;
    indices.add(i);
  }
  return indices;
};
