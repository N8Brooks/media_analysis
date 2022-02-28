// Based on the unicode report of text segmentation: https://www.unicode.org/reports/tr29/#Sentence_Boundaries
// With enough effort perhaps this could be a single `RegExp`

const CR = "\\u{000D}";

const LF = "\\u{000A}";

const SEP = "\\u{0085}\\u{2028}\\u{2029}";

// * This one is pre-bracketed
const SP = `[^\\S${CR}${LF}${SEP}]`;

const LOWER = "\\p{Lowercase}";

const UPPER = "\\p{Uppercase}";

const NUMERIC = "0-9\\u{FF10}-\\u{FF19}\\u{066B}\\u{066C}";

const ATERM = "\\u{002E}\\u{2024}\\u{FE52}\\u{FF0E}";

const SCONTINUE =
  "\\u{002C}\\u{002D}\\u{003A}\\u{055D}\\u{060C}\\u{060D}\\u{07F8}\\u{1802}\\u{1808}\\u{2013}\\u{2014}\\u{3001}\\u{FE10}\\u{FE11}\\u{FE13}\\u{FE31}\\u{FE32}\\u{FE50}\\u{FE51}\\u{FE55}\\u{FE58}\\u{FE63}\\u{FF0C}\\u{FF0D}\\u{FF1A}\\u{FF64}";

const STERM = "\\p{Sentence_Terminal}";

const CLOSE = "\\p{Open_Punctuation}\\p{Close_Punctuation}\\p{Quotation_Mark}";

const PARA_SEP = `${SEP}${CR}${LF}`;

const SATERM = `${STERM}${ATERM}`;

// SB1 and SB2 are implied

const SB3 = `(?<=[${CR}])(?=[${LF}])`;
const sb3 = new RegExp(SB3, "ug");

const SB4 = `(?<=[${PARA_SEP}])`;
const sb4 = new RegExp(SB4, "ug");

// Skip rule 5

const SB6 = `(?<=[${ATERM}])(?=[${NUMERIC}])`;
const sb6 = new RegExp(SB6, "ug");

const SB7 = `(?<=(?:[${LOWER}]|[${UPPER}])[${ATERM}])(?=[${UPPER}])`;
const sb7 = new RegExp(SB7, "ug");

const SB8 =
  `(?<=[${ATERM}][${CLOSE}]*${SP}*)(?=[^${UPPER}${LOWER}${PARA_SEP}${SATERM}]*[${LOWER}])`;
const sb8 = new RegExp(SB8, "ug");

const SB9 = `(?<=[${SATERM}][${CLOSE}]*)(?=(?:[${CLOSE}]|${SP}|[${PARA_SEP}]))`;
const sb9 = new RegExp(SB9, "ug");

// Combined with 8a
const SB10 =
  `(?<=[${SATERM}][${CLOSE}]*${SP}*)(?=(?:${SP}|[${PARA_SEP}]|[${SCONTINUE}]|[${STERM}]|[${ATERM}]))`;
const sb10 = new RegExp(SB10, "ug");

const SB11 = `(?<=[${SATERM}][${CLOSE}]*${SP}*[${PARA_SEP}]?)`;
const sb11 = new RegExp(SB11, "ug");

export const segment = (document: string): string[] => {
  const boundaries: Set<number> = new Set();

  for (const positive of [sb4, sb11]) {
    for (const { index } of document.matchAll(positive)) {
      if (index) {
        boundaries.add(index);
      } else {
        console.warn(`Index was not defined for ${document} with ${positive}`);
      }
    }
  }

  for (const negative of [sb3, sb6, sb7, sb8, sb9, sb10]) {
    for (const { index } of document.matchAll(negative)) {
      if (index) {
        boundaries.delete(index);
      } else {
        console.warn(`Index was not defined for ${document} with ${negative}`);
      }
    }
  }

  boundaries.add(document.length);
  const sentences = [...boundaries]
    .sort((a, b) => a - b)
    .map((end, i, arr) => {
      const start = arr[i - 1] ?? 0;
      return document.substring(start, end);
    });

  return sentences;
};
