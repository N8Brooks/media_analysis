import { CSV } from "./deps.ts";
import { vectorize } from "./vectorize.ts";
import { Sample } from "./sample.ts";

/** A row of a CSV file */
type Row = Record<string, string>;

/** Parses a record from the dataset */
const parseRecord = (
  { question, text, target }: Record<string, string>,
): Sample => {
  return {
    x: vectorize(text),
    y: +target as -1 | 1,
    weight: +question, // temp
  };
};

/** Returns a unique identifier for the `y`-`question` pair */
const getPseudoClass = ({ y, weight: question }: Sample): string => {
  return `${y},${question}`;
};

/** Balances classes among combinations of `question` and `y` in-place */
const balanceClasses = (data: Sample[]) => {
  const binCounts: Map<string, number> = new Map();
  data.forEach((datum) => {
    const pseudoClass = getPseudoClass(datum);
    const binCount = binCounts.get(pseudoClass) ?? 0;
    binCounts.set(pseudoClass, binCount + 1);
    return pseudoClass;
  });
  const weights = Object.fromEntries(
    [...binCounts].map(([pseudoClass, binCount]) => {
      const weight = data.length / (binCounts.size * binCount);
      return [pseudoClass, weight];
    }),
  );
  data.forEach((datum) => {
    const pseudoClass = getPseudoClass(datum);
    datum.weight = weights[pseudoClass];
  });
};

/** Parses a given dataset file and returns */
export const loadData = async (filename: string): Promise<Sample[]> => {
  const text = await Deno.readTextFile(filename);
  const csv = await CSV.parse(text, { skipFirstRow: true }) as Row[];
  const data = csv.map((record) => parseRecord(record));
  balanceClasses(data);
  return data;
};
