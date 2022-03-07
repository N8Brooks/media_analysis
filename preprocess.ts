/** Apostrophe aliases that aren't stripped in NFKD normalization */
const APOSTROPHES = /[\u{2018}\u{2019}\u{201B}]/gu;

/** Final stop that is strictly assumed to be a period */
const ENDING_FINAL_STOP =
  /\.([\p{White_Space}\p{Open_Punctuation}\p{Close_Punctuation}\p{Quotation_Mark}]*)$/u;

/** Lower cases, normalize characters, and trim */
export const preprocess = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(APOSTROPHES, "'")
    .replace(/\.{2,}/g, " ... ") // assists tokenization
    .replace(ENDING_FINAL_STOP, " .$1") // assists tokenization
    .replace(/[_\s]+/g, " ");
};
