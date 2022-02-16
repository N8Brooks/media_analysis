// https://www.nltk.org/_modules/nltk/stem/lancaster.html

/** Lancaster rule definition */
interface Rule {
  /** Applies to words ending with */
  oldSuffix: string;

  /** Replaces the old suffix */
  newSuffix: string;

  /** Whether the rule can only be applied if it hasn't been modified */
  isIntact: boolean;

  /** How many characters should be removed from the word */
  deleteCount: number;

  /** Whether no more rules should be applied */
  isFinal: boolean;
}

/** All lowercase vowels including `"y"` */
const VOWELS = "aeiouy";

// deno-fmt-ignore
/** Lancaster rules by last lowercase letter */
const RULES: Record<string, Rule[]> = {
  a: [
    {oldSuffix: "ia", newSuffix: "", isIntact: true, deleteCount: 2, isFinal: true},
    {oldSuffix: "a", newSuffix: "", isIntact: true, deleteCount: 1, isFinal: true},
  ],
  b: [
    {oldSuffix: "bb", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: true},
  ],
  c: [
    {oldSuffix: "ytic", newSuffix: "s", isIntact: false, deleteCount: 3, isFinal: true},
    {oldSuffix: "ic", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: false},
    {oldSuffix: "nc", newSuffix: "t", isIntact: false, deleteCount: 1, isFinal: false},
  ],
  d: [
    {oldSuffix: "dd", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: true},
    {oldSuffix: "ied", newSuffix: "y", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "ceed", newSuffix: "ss", isIntact: false, deleteCount: 2, isFinal: true},
    {oldSuffix: "eed", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: true},
    {oldSuffix: "ed", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: false},
    {oldSuffix: "hood", newSuffix: "", isIntact: false, deleteCount: 4, isFinal: false},
  ],
  e: [
    {oldSuffix: "e", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: false},
  ],
  f: [
    {oldSuffix: "lief", newSuffix: "v", isIntact: false, deleteCount: 1, isFinal: true},
    {oldSuffix: "if", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: false},
  ],
  g: [
    {oldSuffix: "ing", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "iag", newSuffix: "y", isIntact: false, deleteCount: 3, isFinal: true},
    {oldSuffix: "ag", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: false},
    {oldSuffix: "gg", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: true},
  ],
  h: [
    {oldSuffix: "th", newSuffix: "", isIntact: true, deleteCount: 2, isFinal: true},
    {oldSuffix: "guish", newSuffix: "ct", isIntact: false, deleteCount: 5, isFinal: true},
    {oldSuffix: "ish", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: false},
  ],
  i: [
    {oldSuffix: "i", newSuffix: "", isIntact: true, deleteCount: 1, isFinal: true},
    {oldSuffix: "i", newSuffix: "y", isIntact: false, deleteCount: 1, isFinal: false},
  ],
  j: [
    {oldSuffix: "ij", newSuffix: "d", isIntact: false, deleteCount: 1, isFinal: true},
    {oldSuffix: "fuj", newSuffix: "s", isIntact: false, deleteCount: 1, isFinal: true},
    {oldSuffix: "uj", newSuffix: "d", isIntact: false, deleteCount: 1, isFinal: true},
    {oldSuffix: "oj", newSuffix: "d", isIntact: false, deleteCount: 1, isFinal: true},
    {oldSuffix: "hej", newSuffix: "r", isIntact: false, deleteCount: 1, isFinal: true},
    {oldSuffix: "verj", newSuffix: "t", isIntact: false, deleteCount: 1, isFinal: true},
    {oldSuffix: "misj", newSuffix: "t", isIntact: false, deleteCount: 2, isFinal: true},
    {oldSuffix: "nj", newSuffix: "d", isIntact: false, deleteCount: 1, isFinal: true},
    {oldSuffix: "j", newSuffix: "s", isIntact: false, deleteCount: 1, isFinal: true},
  ],
  l: [
    {oldSuffix: "ifiabl", newSuffix: "", isIntact: false, deleteCount: 6, isFinal: true},
    {oldSuffix: "iabl", newSuffix: "y", isIntact: false, deleteCount: 4, isFinal: true},
    {oldSuffix: "abl", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "ibl", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: true},
    {oldSuffix: "bil", newSuffix: "l", isIntact: false, deleteCount: 2, isFinal: false},
    {oldSuffix: "cl", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: true},
    {oldSuffix: "iful", newSuffix: "y", isIntact: false, deleteCount: 4, isFinal: true},
    {oldSuffix: "ful", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "ul", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: true},
    {oldSuffix: "ial", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "ual", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "al", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: false},
    {oldSuffix: "ll", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: true},
  ],
  m: [
    {oldSuffix: "ium", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: true},
    {oldSuffix: "um", newSuffix: "", isIntact: true, deleteCount: 2, isFinal: true},
    {oldSuffix: "ism", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "mm", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: true},
  ],
  n: [
    {oldSuffix: "sion", newSuffix: "j", isIntact: false, deleteCount: 4, isFinal: false},
    {oldSuffix: "xion", newSuffix: "ct", isIntact: false, deleteCount: 4, isFinal: true},
    {oldSuffix: "ion", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "ian", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "an", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: false},
    {oldSuffix: "een", newSuffix: "", isIntact: false, deleteCount: 0, isFinal: true},
    {oldSuffix: "en", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: false},
    {oldSuffix: "nn", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: true},
  ],
  p: [
    {oldSuffix: "ship", newSuffix: "", isIntact: false, deleteCount: 4, isFinal: false},
    {oldSuffix: "pp", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: true},
  ],
  r: [
    {oldSuffix: "er", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: false},
    {oldSuffix: "ear", newSuffix: "", isIntact: false, deleteCount: 0, isFinal: true},
    {oldSuffix: "ar", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: true},
    {oldSuffix: "or", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: false},
    {oldSuffix: "ur", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: false},
    {oldSuffix: "rr", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: true},
    {oldSuffix: "tr", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: false},
    {oldSuffix: "ier", newSuffix: "y", isIntact: false, deleteCount: 3, isFinal: false},
  ],
  s: [
    {oldSuffix: "ies", newSuffix: "y", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "sis", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: true},
    {oldSuffix: "is", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: false},
    {oldSuffix: "ness", newSuffix: "", isIntact: false, deleteCount: 4, isFinal: false},
    {oldSuffix: "ss", newSuffix: "", isIntact: false, deleteCount: 0, isFinal: true},
    {oldSuffix: "ous", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "us", newSuffix: "", isIntact: true, deleteCount: 2, isFinal: true},
    {oldSuffix: "s", newSuffix: "", isIntact: true, deleteCount: 1, isFinal: false},
    {oldSuffix: "s", newSuffix: "", isIntact: false, deleteCount: 0, isFinal: true},
  ],
  t: [
    {oldSuffix: "plicat", newSuffix: "y", isIntact: false, deleteCount: 4, isFinal: true},
    {oldSuffix: "at", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: false},
    {oldSuffix: "ment", newSuffix: "", isIntact: false, deleteCount: 4, isFinal: false},
    {oldSuffix: "ent", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "ant", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "ript", newSuffix: "b", isIntact: false, deleteCount: 2, isFinal: true},
    {oldSuffix: "orpt", newSuffix: "b", isIntact: false, deleteCount: 2, isFinal: true},
    {oldSuffix: "duct", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: true},
    {oldSuffix: "sumpt", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: true},
    {oldSuffix: "cept", newSuffix: "iv", isIntact: false, deleteCount: 2, isFinal: true},
    {oldSuffix: "olut", newSuffix: "v", isIntact: false, deleteCount: 2, isFinal: true},
    {oldSuffix: "sist", newSuffix: "", isIntact: false, deleteCount: 0, isFinal: true},
    {oldSuffix: "ist", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "tt", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: true},
  ],
  u: [
    {oldSuffix: "iqu", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: true},
    {oldSuffix: "ogu", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: true},
  ],
  v: [
    {oldSuffix: "siv", newSuffix: "j", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "eiv", newSuffix: "", isIntact: false, deleteCount: 0, isFinal: true},
    {oldSuffix: "iv", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: false},
  ],
  y: [
    {oldSuffix: "bly", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: false},
    {oldSuffix: "ily", newSuffix: "y", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "ply", newSuffix: "", isIntact: false, deleteCount: 0, isFinal: true},
    {oldSuffix: "ly", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: false},
    {oldSuffix: "ogy", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: true},
    {oldSuffix: "phy", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: true},
    {oldSuffix: "omy", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: true},
    {oldSuffix: "opy", newSuffix: "", isIntact: false, deleteCount: 1, isFinal: true},
    {oldSuffix: "ity", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "ety", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "lty", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: true},
    {oldSuffix: "istry", newSuffix: "", isIntact: false, deleteCount: 5, isFinal: true},
    {oldSuffix: "ary", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "ory", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: false},
    {oldSuffix: "ify", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: true},
    {oldSuffix: "ncy", newSuffix: "t", isIntact: false, deleteCount: 2, isFinal: false},
    {oldSuffix: "acy", newSuffix: "", isIntact: false, deleteCount: 3, isFinal: false},
  ],
  z: [
    {oldSuffix: "iz", newSuffix: "", isIntact: false, deleteCount: 2, isFinal: false},
    {oldSuffix: "yz", newSuffix: "s", isIntact: false, deleteCount: 1, isFinal: true},
  ],
};

/** Stems a lowercase word from the latin alphabet to its basic equivalent with lancaster method */
export const stem = (word: string): string => {
  let isIntact = true;
  let isRuleApplied: boolean;
  do {
    isRuleApplied = false;

    const lastChar = word[word.length - 1];
    if (!(lastChar in RULES)) {
      return word;
    }

    for (const rule of RULES[lastChar]) {
      if (!word.endsWith(rule.oldSuffix)) {
        continue;
      }

      if (!isIntact && rule.isIntact) {
        continue;
      }

      // Meets rule criteria
      const baseLength = word.length - rule.deleteCount;
      if (VOWELS.includes(word[0])) {
        if (baseLength < 2) {
          continue;
        }
      } else {
        if (baseLength < 3) {
          continue;
        }
        if (!VOWELS.includes(word[1]) && !VOWELS.includes(word[2])) {
          continue;
        }
      }

      // Apply rule
      word = `${word.substring(0, baseLength)}${rule.newSuffix}`;

      if (rule.isFinal) {
        return word;
      }

      isIntact = false;
      isRuleApplied = true;
    }
  } while (isRuleApplied);
  return word;
};
