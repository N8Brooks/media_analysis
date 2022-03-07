/// <reference types="./segmenter.d.ts" />

// https://en.wikipedia.org/wiki/Feature_hashing

import { N_FEATURES } from "./constants.ts";
import { EnglishStemmer, murmurHash3 } from "./deps.ts";
import { preprocess } from "./preprocess.ts";
import { STOP_WORDS } from "./stop_words.ts";
import { tokenize } from "./tokenize.ts";

/** Penn Treebank stemmer instance */
const stemmer = new EnglishStemmer();

/** English sentence segmenter instance */
const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });

/** Binary vectors of a `text`'s paragraphs */
export const vectorize = (text: string): Set<number>[] => {
  return [...segmenter.segment(text)]
    .map(({ segment }) => {
      const vector: Set<number> = new Set();
      for (const word of tokenize(preprocess(segment))) {
        if (word in STOP_WORDS) {
          continue;
        }
        const base = stemmer.stem(word);
        const index = murmurHash3(base) % N_FEATURES;
        vector.add(index);
      }
      return vector;
    })
    .filter((vector) => vector.size);
};
