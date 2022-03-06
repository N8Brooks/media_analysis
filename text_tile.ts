// TODO: implement properly

const PARAGRAPH_LENGTH = 5;

/** Tokenized paragraphs from given tokenized sentences */
export const textTile = (sentences: string[][]): string[][] => {
  const tiles: string[][] = [];
  for (let i = 0; i < sentences.length; i += PARAGRAPH_LENGTH) {
    const tile = sentences.slice(i, i + PARAGRAPH_LENGTH).flat();
    tiles.push(tile);
  }
  return tiles;
};
