/// <reference lib="dom" />

import { vectorize } from "./vectorize.ts";
import { probability } from "./binary_classifier.ts";
import { marginOfError, mean } from "./statistics.ts";

/** Attributes for the parent SVG element */
const POLITICAL_COMPASS_ATTRIBUTES = {
  tabindex: "0",
  tagName: "svg",
  idPrefix: "political-compass",
  titleText: "Political Compass",
  descText: "Places samples of text on the political compass",
  viewBox: "0 0 100 100",
  role: "img",
  "aria-live": "polite",
};

/** Authoritarian left quadrant attributes */
const Q2_ATTRIBUTES = {
  tagName: "rect",
  style: "fill: #fa7576",
  width: "50%",
  height: "50%",
  x: "0%",
  y: "0%",
};

/** Authoritarian right quadrant attributes */
const Q1_ATTRIBUTES = {
  tagName: "rect",
  style: "fill: #a0d5ff",
  width: "50%",
  height: "50%",
  x: "50%",
  y: "0%",
};

/** Libertarian left quadrant attributes */
const Q3_ATTRIBUTES = {
  tagName: "rect",
  style: "fill: #cdf6ca",
  width: "50%",
  height: "50%",
  x: "0%",
  y: "50%",
};

/** Libertarian right quadrant attributes */
const Q4_ATTRIBUTES = {
  tagName: "rect",
  style: "fill: #e0cdf5",
  width: "50%",
  height: "50%",
  x: "50%",
  y: "50%",
};

/** Attributes for the 95% confidence region */
const CONFIDENCE_REGION_95_ATTRIBUTES = {
  role: "presentation",
  tabindex: "0",
  tagName: "ellipse",
  idPrefix: "confidence-region-95",
  titleText: "95% Confidence Interval between -10 and 10",
  descText: "", // This will be updated
  style: "fill: lightGray; opacity: 60%",
  visibility: "hidden", // Only shown on prediction
};

/** Attributes for the 80% confidence region */
const CONFIDENCE_REGION_80_ATTRIBUTES = {
  role: "presentation",
  tabindex: "0",
  tagName: "ellipse",
  idPrefix: "confidence-region-80",
  titleText: "80% Confidence Interval between -10 and 10",
  descText: "", // This will be updated
  style: "fill: gray; opacity: 60%",
  visibility: "hidden", // Only shown on prediction
};

/** Attributes for the prediction mean */
const PREDICTION_MEAN_ATTRIBUTES = {
  role: "presentation",
  tabindex: "0",
  tagName: "circle",
  idPrefix: "prediction-mean",
  titleText: "Prediction Mean",
  descText: "", // This will be updated
  fill: "black",
  r: "2%",
  visibility: "hidden", // Only shown on prediction
};

/** Specifications for svg elements */
interface SvgElementOptions {
  /** The tag name of the SVG element created */
  tagName: string;
  /** Extraneous attributes to add to the SVG */
  [attributeName: string]: string;
}

/** Creates a namespaced svg element with the given attributes */
const svgElementFactory = (
  { tagName, ...attributes }: SvgElementOptions,
): SVGElement => {
  const element = document.createElementNS(
    "http://www.w3.org/2000/svg",
    tagName,
  );
  for (const attribute of Object.entries(attributes)) {
    element.setAttribute(...attribute);
  }
  return element;
};

/** Specifications for an accessible svg element */
interface AccessibleSvgElementOptions extends SvgElementOptions {
  /** Unique id prefix for title and desc */
  idPrefix: string;
  /** Inner text for title */
  titleText: string;
  /** Inner text for desc */
  descText: string;
}

/** Creates a namespaced svg element that is accessible */
const accessibleSvgElementFactory = (
  { idPrefix, titleText, descText, ...attributes }: AccessibleSvgElementOptions,
): SVGElement => {
  const titleElement = document.createElement("title");
  titleElement.innerText = titleText;
  titleElement.id = `${idPrefix}-title`;

  const descElement = document.createElement("desc");
  descElement.innerText = descText;
  descElement.id = `${idPrefix}-desc`;

  const element = svgElementFactory(attributes);
  const labelledBy = `${titleElement.id} ${descElement.id}`;
  element.setAttribute("aria-labelledby", labelledBy);
  element.prepend(titleElement, descElement);

  return element;
};

/** Updatable political compass graphic */
class PoliticalCompass extends HTMLElement {
  #societyWeights?: Float32Array;
  #economyWeights?: Float32Array;
  #predictionMean: SVGElement;
  #confidenceRegion80: SVGElement;
  #confidenceRegion95: SVGElement;

  constructor() {
    super();

    // Parent element of the visual
    const svg = accessibleSvgElementFactory(POLITICAL_COMPASS_ATTRIBUTES);

    // Colorful quadrants
    svg.appendChild(svgElementFactory(Q1_ATTRIBUTES));
    svg.appendChild(svgElementFactory(Q2_ATTRIBUTES));
    svg.appendChild(svgElementFactory(Q3_ATTRIBUTES));
    svg.appendChild(svgElementFactory(Q4_ATTRIBUTES));

    // Confidence regions and mean
    this.#confidenceRegion95 = accessibleSvgElementFactory(
      CONFIDENCE_REGION_95_ATTRIBUTES,
    );
    svg.appendChild(this.#confidenceRegion95);
    this.#confidenceRegion80 = accessibleSvgElementFactory(
      CONFIDENCE_REGION_80_ATTRIBUTES,
    );
    svg.appendChild(this.#confidenceRegion80);
    this.#predictionMean = accessibleSvgElementFactory(
      PREDICTION_MEAN_ATTRIBUTES,
    );
    svg.appendChild(this.#predictionMean);

    this.attachShadow({ mode: "open" }).append(svg);
  }

  /** Used to add society weights asynchronously */
  set societyWeights(societyWeights: Float32Array) {
    if (this.#societyWeights) {
      console.warn("Society weights should only be set once");
    }
    this.#societyWeights = societyWeights;
  }

  /** Used to add economy weights asynchronously */
  set economyWeights(economyWeights: Float32Array) {
    if (this.#economyWeights) {
      console.warn("Economy weights should only be set once");
    }
    this.#economyWeights = economyWeights;
  }

  /** Compute the political compass confidence region for an `Array` of texts */
  computeConfidenceRegion(texts: string[]): void {
    if (!this.#societyWeights || !this.#economyWeights) {
      console.warn("One or both of the weights has not been set");
      return;
    }

    // Remove ellipse
    if (texts.length === 0) {
      this.#confidenceRegion95.setAttribute("visibility", "hidden");
      this.#confidenceRegion80.setAttribute("visibility", "hidden");
      this.#predictionMean.setAttribute("visibility", "hidden");
      return;
    }

    const societyProbabilities: number[] = [];
    const economyProbabilities: number[] = [];
    for (const text of texts) {
      const x = vectorize(text);
      const societyProbability = probability(x, this.#societyWeights!);
      societyProbabilities.push(societyProbability);
      const economyProbability = probability(x, this.#economyWeights!);
      economyProbabilities.push(economyProbability);
    }

    const societyMean = mean(societyProbabilities);
    const societyMarginOfError80 = marginOfError(societyProbabilities, 0.2);
    const societyMarginOfError95 = marginOfError(societyProbabilities, 0.05);

    const economyMean = mean(economyProbabilities);
    const economyMarginOfError80 = marginOfError(societyProbabilities, 0.2);
    const economyMarginOfError95 = marginOfError(societyProbabilities, 0.05);

    this.#renderConfidenceRegion({
      confidenceRegion: this.#confidenceRegion80,
      interval: "80%",
      societyMean,
      economyMean,
      societyMoe: societyMarginOfError80,
      economyMoe: economyMarginOfError80,
    });
    this.#renderConfidenceRegion({
      confidenceRegion: this.#confidenceRegion95,
      interval: "95%",
      societyMean,
      economyMean,
      societyMoe: societyMarginOfError95,
      economyMoe: economyMarginOfError95,
    });
    this.#setPredictionMean({ societyMean, economyMean });
  }

  /** Update the svg ellipse representing the 95% confidence region */
  #renderConfidenceRegion({
    confidenceRegion,
    interval,
    societyMean,
    economyMean,
    societyMoe,
    economyMoe,
  }: {
    confidenceRegion: SVGElement;
    interval: string;
    societyMean: number;
    economyMean: number;
    societyMoe: number;
    economyMoe: number;
  }): void {
    // Calculate standard scores for accessability in [-10, 10]
    const societyLowerBound = Math.round(10 * (societyMean - societyMoe));
    const societyUpperBound = Math.round(10 * (societyMean + societyMoe));
    const economyLowerBound = Math.round(10 * (economyMean - economyMoe));
    const economyUpperBound = Math.round(10 * (economyMean + economyMoe));
    const desc = confidenceRegion.children[1] as HTMLElement;
    desc.innerText =
      `Society axis ${interval} confidence interval between ${societyLowerBound} and ${societyUpperBound};\
      economy axis ${interval} confidence interval  between ${economyLowerBound} and ${economyUpperBound}`;

    // The SVG needs percentages in [0, 100]%
    const cx = 100 * (1 + societyMean) / 2 + "%";
    const cy = 100 * (1 + economyMean) / 2 + "%";
    const rx = 100 * societyMoe + "%";
    const ry = 100 * economyMoe + "%";
    confidenceRegion.setAttribute("cx", cx);
    confidenceRegion.setAttribute("cy", cy);
    confidenceRegion.setAttribute("rx", rx);
    confidenceRegion.setAttribute("ry", ry);
    confidenceRegion.setAttribute("visibility", "visible");
  }

  /** Update the svg showing the sample mean */
  #setPredictionMean(
    { societyMean, economyMean }: Record<string, number>,
  ): void {
    // Standard scores for accessability in [-10, 10]
    const desc = this.#predictionMean.children[1] as HTMLElement;
    const societyMeanPrediction = Math.round(10 * societyMean);
    const economyMeanPrediction = Math.round(10 * economyMean);
    desc.innerText = `Society mean prediction of ${societyMeanPrediction};\
      economy axis mean prediction of ${economyMeanPrediction}`;

    // The SVG needs percentages in [0, 100]%
    const cx = 100 * (1 + societyMean) / 2 + "%";
    const cy = 100 * (1 + economyMean) / 2 + "%";
    this.#predictionMean.setAttribute("cx", cx);
    this.#predictionMean.setAttribute("cy", cy);
    this.#predictionMean.setAttribute("visibility", "visible");
  }
}

customElements.define("political-compass", PoliticalCompass);
