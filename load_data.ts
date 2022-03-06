import { CSV } from "./deps.ts";
import { vectorize } from "./vectorize.ts";
import { Prediction, Sample } from "./types.ts";

/** A row of a CSV file */
type Row = Record<string, string>;

/** Union of given sets */
const union = <T>(sets: Set<T>[]) => {
  const u: Set<T> = new Set();
  for (const set of sets) {
    set.forEach((i) => {
      u.add(i);
    });
  }
  return u;
};

/** Parses a record from the dataset */
export const parseRecord = ({ question, text, target }: Row): Sample => {
  if (target !== "-1" && target !== "1") {
    throw new RangeError(`Target ${target} is not -1 or 1`);
  }
  const vector = union(vectorize(text));
  return {
    x: vector,
    y: +target as Prediction,
    weight: +question,
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
  // Weight is actually question
  const data = csv
    .map((record) => parseRecord(record))
    .filter((record) => record.x.size);
  // Re-named to show weight is now weight
  const samples = balanceClasses(data);
  return samples;
};
