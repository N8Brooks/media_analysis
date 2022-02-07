/// <reference lib="dom" />

import { vectorize } from "./vectorize.ts";
import { probability } from "./binary_classifier.ts";
import { marginOfError, mean } from "./statistics.ts";

/** Used for when there is only one text */
const MAX_AXIS_LENGTH = 1_000;

/** Attributes for estimate mean */
const POINT_ATTRIBUTES = {
  cx: "50%",
  cy: "50%",
  fill: "Black",
  r: "2%",
};

/** The minimum ellipse axis size for the confidence interval */
const MIN_AXIS_LENGTH_80 = 5;

/** 80% confidence region attributes */
const CONFIDENCE_REGION_80_ATTRIBUTES = {
  cx: "50%",
  cy: "50%",
  rx: `${MIN_AXIS_LENGTH_80}%`,
  ry: `${MIN_AXIS_LENGTH_80}%`,
};

/** Confidence region styling */
const CONFIDENCE_REGION_80_STYLE = "fill: Gray; opacity: 60%";

const MIN_AXIS_LENGTH_95 = 10;

/** 95% confidence region attributes */
const CONFIDENCE_REGION_95_ATTRIBUTES = {
  cx: "50%",
  cy: "50%",
  rx: `${MIN_AXIS_LENGTH_95}%`,
  ry: `${MIN_AXIS_LENGTH_95}%`,
};

const CONFIDENCE_REGION_95_STYLE = "fill: LightGray; opacity: 60%";

/** Authoritarian left quadrant attributes */
const Q2_ATTRIBUTES = {
  style: "fill: #fa7576",
  width: "50%",
  height: "50%",
  x: "0%",
  y: "0%",
};

/** Authoritarian right quadrant attributes */
const Q1_ATTRIBUTES = {
  style: "fill: #a0d5ff",
  width: "50%",
  height: "50%",
  x: "50%",
  y: "0%",
};

/** Libertarian left quadrant attributes */
const Q3_ATTRIBUTES = {
  style: "fill: #cdf6ca",
  width: "50%",
  height: "50%",
  x: "0%",
  y: "50%",
};

/** Libertarian right quadrant attributes */
const Q4_ATTRIBUTES = {
  style: "fill: #e0cdf5",
  width: "50%",
  height: "50%",
  x: "50%",
  y: "50%",
};

/** Creates a namespaced svg element with the given specifications */
const svgElementFactory = (
  name: string,
  attributes: Record<string, string>,
): SVGElement => {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  return element;
};

/** Updatable political compass graphic */
class PoliticalCompass extends HTMLElement {
  #societyWeights?: Float32Array;
  #economyWeights?: Float32Array;
  #point: SVGElement;
  #confidenceRegion80: SVGElement;
  #confidenceRegion95: SVGElement;

  constructor() {
    super();

    const style = document.createElement("style");
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.appendChild(svgElementFactory("rect", Q1_ATTRIBUTES));
    svg.appendChild(svgElementFactory("rect", Q2_ATTRIBUTES));
    svg.appendChild(svgElementFactory("rect", Q3_ATTRIBUTES));
    svg.appendChild(svgElementFactory("rect", Q4_ATTRIBUTES));

    this.#confidenceRegion95 = svgElementFactory(
      "ellipse",
      CONFIDENCE_REGION_95_ATTRIBUTES,
    );
    this.#confidenceRegion95.setAttribute("style", CONFIDENCE_REGION_95_STYLE);
    this.setConfidenceRegion95();
    svg.appendChild(this.#confidenceRegion95);

    this.#confidenceRegion80 = svgElementFactory(
      "ellipse",
      CONFIDENCE_REGION_80_ATTRIBUTES,
    );
    this.#confidenceRegion80.setAttribute("style", CONFIDENCE_REGION_80_STYLE);
    this.setConfidenceRegion80();
    svg.appendChild(this.#confidenceRegion80);

    this.#point = svgElementFactory("circle", POINT_ATTRIBUTES);
    this.#point = svg.appendChild(this.#point);

    this.attachShadow({ mode: "open" }).append(style, svg);
  }

  /** Used to add society weights asynchronously */
  set societyWeights(societyWeights: Float32Array) {
    if (societyWeights) {
      console.warn("Society weights should only be set once");
    }
    this.#societyWeights = societyWeights;
  }

  /** Used to add economy weights asynchronously */
  set economyWeights(economyWeights: Float32Array) {
    if (economyWeights) {
      console.warn("Economy weights should only be set once");
    }
    this.#economyWeights = economyWeights;
  }

  /** Update the svg ellipse representing the 95% confidence region */
  setConfidenceRegion95(
    { cx, cy, rx, ry } = CONFIDENCE_REGION_95_ATTRIBUTES,
  ): void {
    this.#confidenceRegion95.setAttribute("cx", cx);
    this.#confidenceRegion95.setAttribute("cy", cy);
    this.#confidenceRegion95.setAttribute("rx", rx);
    this.#confidenceRegion95.setAttribute("ry", ry);
  }

  /** Update the svg ellipse representing the 80% confidence region */
  setConfidenceRegion80(
    { cx, cy, rx, ry } = CONFIDENCE_REGION_80_ATTRIBUTES,
  ): void {
    this.#confidenceRegion80.setAttribute("cx", cx);
    this.#confidenceRegion80.setAttribute("cy", cy);
    this.#confidenceRegion80.setAttribute("rx", rx);
    this.#confidenceRegion80.setAttribute("ry", ry);
  }

  /** Update the svg showing the sample mean */
  setPoint(cx = "50%", cy = "50%"): void {
    this.#point.setAttribute("cx", cx);
    this.#point.setAttribute("cy", cy);
  }

  /** Compute the political compass confidence region for an `Array` of texts */
  computeConfidenceRegion(texts: string[]): void {
    if (!this.#societyWeights || !this.#economyWeights) {
      console.warn("One or both of the weights has not been set");
      return;
    }

    console.log(texts.length);

    // Show default ellipse shape
    if (texts.length === 0) {
      this.setConfidenceRegion80();
      this.setConfidenceRegion95();
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
    const cx = 100 * (1 + societyMean) / 2 + "%";
    const societyMarginOfError80 = marginOfError(societyProbabilities, 0.2);
    const rx80 = (100 * societyMarginOfError80 || MAX_AXIS_LENGTH) + "%";
    const societyMarginOfError95 = marginOfError(societyProbabilities, 0.05);
    const rx95 = (100 * societyMarginOfError95 || MAX_AXIS_LENGTH) + "%";

    const economyMean = mean(economyProbabilities);
    const cy = 100 * (1 - economyMean) / 2 + "%";
    const economyMarginOfError80 = marginOfError(societyProbabilities, 0.2);
    const ry80 = (100 * economyMarginOfError80 || MAX_AXIS_LENGTH) + "%";
    const economyMarginOfError95 = marginOfError(societyProbabilities, 0.05);
    const ry95 = (100 * economyMarginOfError95 || MAX_AXIS_LENGTH) + "%";

    this.setConfidenceRegion95({ cx, cy, rx: rx95, ry: ry95 });
    this.setConfidenceRegion80({ cx, cy, rx: rx80, ry: ry80 });
    this.setPoint(cx, cy);
  }
}

customElements.define("political-compass", PoliticalCompass);
