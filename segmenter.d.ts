declare namespace Intl {
  type SegmenterGranularityType = "grapheme" | "word" | "sentence";

  type Segment = {
    segment: string;
    index: number;
    input: string;
    isWordLike?: boolean;
  };

  interface SegmenterOptions {
    granularity?: SegmenterGranularityType;
  }

  interface ResolvedSegmenterOptions {
    locale: string;
    granularity: SegmenterGranularityType;
  }

  interface LocaleMatcherOptions {
    localeMatcher?: "lookup" | "best fit";
  }

  interface Segments {
    containing(codeUnitIndex?: number): Segment;
    [Symbol.iterator](): IterableIterator<Segment>;
  }

  interface Segmenter {
    resolvedOptions(): ResolvedSegmenterOptions;
    segment(input: string): Segments;
  }

  const Segmenter: {
    new (locales?: string | string[], options?: SegmenterOptions): Segmenter;

    supportedLocalesOf(
      locales: string | string[],
      options?: LocaleMatcherOptions,
    ): string[];
  };
}
