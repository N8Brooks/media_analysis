// https://en.wikipedia.org/wiki/Feature_hashing

import { N_FEATURES, STOP_WORDS } from "./constants.ts";
import { EnglishStemmer, murmurHash3 } from "./deps.ts";

/** Matches underscores, digits and diacritics */
const TRANSFORM = /[_\p{Diacritic}]/gu;

/** Designates what words are vectorized; hyphens and apostrophes are boundaries */
const TOKEN = /\b\w\w+\b/gu;

/** Snowball stemming instance */
const stemmer = new EnglishStemmer();

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
  for (const [token] of preprocess(text).matchAll(TOKEN)) {
    if (token in STOP_WORDS) {
      continue;
    }
    const base = stemmer.stem(token);
    const i = murmurHash3(base) % N_FEATURES;
    indices.add(i);
  }
  return indices;
};
