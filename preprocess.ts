/** Popular choices for apostrophes */
const APOSTROPHES = /[\u{0027}\u{2018}\u{2019}\u{201B}]/g;

/** Lower cases, removes accents, joins split words, replaces underscores with spaces, normalizes quotes */
export const preprocess = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(APOSTROPHES, "'")
    .replaceAll("_", " ");
};
