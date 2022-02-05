// https://en.wikipedia.org/wiki/Feature_hashing

import { hash } from "./hash.ts";

/** Designates what words are vectorized */
const TOKEN_PATTERN = /\b\w\w+\b/gu;

/** The number of features to truncate hashes to */
export const N_FEATURES = 2 ** 16;

/** Transform accentuated unicode symbols into their simple counterpart */
const stripAccents = (text: string): string => {
  return text.normalize("NFKD").replace(/\p{Diacritic}/gu, "");
};

/** Converts text to lower case and removes accents */
const preprocess = (text: string): string => {
  return stripAccents(text.toLowerCase());
};

/** Sparse indices of a text's uncased, hashed monograms with no stop words */
export const vectorize = (text: string): Set<number> => {
  const indices: Set<number> = new Set();
  for (const [token] of preprocess(text).matchAll(TOKEN_PATTERN)) {
    const i = hash(token) % N_FEATURES;
    indices.add(i);
  }
  return indices;
};
