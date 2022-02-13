import { CSV } from "./deps.ts";
import { vectorize } from "./vectorize.ts";
import { Prediction, Sample } from "./types.ts";

/** A row of a CSV file */
type Row = Record<string, string>;

/** Parses a record from the dataset */
export const parseRecord = ({ question, text, target }: Row): Sample => {
  if (target !== "-1" && target !== "1") {
    throw new RangeError(`Target ${target} is not -1 or 1`);
  }
  return {
    x: vectorize(text),
    y: +target as Prediction,
    weight: +question, // temp
  };
};

/** Returns a unique identifier for the `y`-`question` pair */
export const getPseudoClass = ({ y, weight: question }: Sample): string => {
  return `${y},${question}`;
};

/** Balances classes among combinations of `question` and `y` in-place */
export const balanceClasses = (data: Sample[]): Sample[] => {
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
  return data;
};

/** Parses a given dataset file and returns */
export const loadData = async (filename: string): Promise<Sample[]> => {
  const text = await Deno.readTextFile(filename);
  const csv = await CSV.parse(text, { skipFirstRow: true }) as Row[];
  const data = csv.map((record) => parseRecord(record)); // Weight is actually question
  const samples = balanceClasses(data); // Re-named to show weight is now weight
  return samples;
};
