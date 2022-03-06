/// <reference types="./segmenter.d.ts" />

// https://en.wikipedia.org/wiki/Feature_hashing

import { N_FEATURES } from "./constants.ts";
import { EnglishStemmer, murmurHash3 } from "./deps.ts";
import { preprocess } from "./preprocess.ts";
import { STOP_WORDS } from "./stop_words.ts";
import { textTile } from "./text_tile.ts";
import { tokenize } from "./tokenize.ts";

/** Penn Treebank stemmer instance */
const stemmer = new EnglishStemmer();

/** English sentence segmenter instance */
const segmenter = new Intl.Segmenter("en", { granularity: "sentence" });

/** Binary vectors of a `text`'s paragraphs */
export const vectorize = (text: string): Set<number>[] => {
  const sentences = [...segmenter.segment(text)]
    .map(({ segment }) => {
      const sentence = preprocess(segment);
      const words = tokenize(sentence)
        .filter((word) => !(word in STOP_WORDS))
        .map((word) => stemmer.stem(word));
      return words;
    });
  return textTile(sentences)
    .map((paragraph) =>
      new Set(paragraph.map((word) => murmurHash3(word) % N_FEATURES))
    );
};
