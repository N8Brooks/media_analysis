import { stemmer } from "./deps.ts";
import { tokenize } from "./tokenize.ts";

/** Tokenized English stop words */
export const STOP_WORDS = Object.freeze(
  Object.fromEntries(
    [...stemmer.stopWords]
      .flatMap((stopWord) => tokenize(stopWord))
      .map((tokenizedStopWord) => [tokenizedStopWord]),
  ),
);
