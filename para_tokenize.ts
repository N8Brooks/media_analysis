// Log character counts from datasets.
// These are still skewed from the 50 word minimum.
// Less so by the 500 word maximum.
// 25% = 5.768321
// 75% = 6.545350
// IQR = 0.777029

/** Minimum paragraph character count - exp(5.768321 - 1.5 * IQR) */
const MIN_PARA_CHAR_COUNT = 100;

/** Uses simple heuristics to split large document into paragraphs */
export const paraTokenize = (documents: string[]): string[] => {
  // This function does not consider "\r"
  documents = documents.filter((p) => p.length >= MIN_PARA_CHAR_COUNT);

  const multiNewlineParas = documents
    .flatMap((document) => document.split("\n\n"))
    .filter((p) => p.length >= MIN_PARA_CHAR_COUNT);

  if (!multiNewlineParas.length) {
    return documents;
  }

  const singleNewlineParas = documents
    .flatMap((document) => document.split("\n"))
    .filter((p) => p.length >= MIN_PARA_CHAR_COUNT);

  return singleNewlineParas.length ? singleNewlineParas : multiNewlineParas;
};
