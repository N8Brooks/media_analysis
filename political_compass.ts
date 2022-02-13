/// <reference lib="dom" />

import { vectorize } from "./vectorize.ts";
import { partialFit, predict, probability } from "./binary_classifier.ts";
import { marginOfError, mean } from "./statistics.ts";
import { Prediction } from "./types.ts";

/** Attributes for the parent SVG element */
const POLITICAL_COMPASS_ATTRIBUTES = {
  tabindex: "0",
  tagName: "svg",
  idPrefix: "political-compass",
  titleText: "Political Compass",
  descText:
    "Accessible visual that places samples of text on the political compass",
  viewBox: "-10 -10 20 20",
  role: "img",
  "aria-live": "polite",
};

/** Authoritarian left quadrant attributes */
const Q2_ATTRIBUTES = {
  tagName: "rect",
  style: "fill: #fa7576",
  width: "10",
  height: "10",
  x: "-10",
  y: "-10",
};

/** Authoritarian right quadrant attributes */
const Q1_ATTRIBUTES = {
  tagName: "rect",
  style: "fill: #a0d5ff",
  width: "10",
  height: "10",
  x: "0",
  y: "-10",
};

/** Libertarian left quadrant attributes */
const Q3_ATTRIBUTES = {
  tagName: "rect",
  style: "fill: #cdf6ca",
  width: "10",
  height: "10",
  x: "-10",
  y: "0",
};

/** Libertarian right quadrant attributes */
const Q4_ATTRIBUTES = {
  tagName: "rect",
  style: "fill: #e0cdf5",
  width: "10",
  height: "10",
  x: "0",
  y: "0",
};

/** Attributes for the 95% confidence region */
const CONFIDENCE_REGION_95_ATTRIBUTES = {
  role: "presentation",
  tabindex: "0",
  tagName: "ellipse",
  idPrefix: "confidence-region-95",
  titleText: "95% Confidence Interval",
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
  titleText: "80% Confidence Interval",
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
  r: "0.5",
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

/** Rounds `x` to `-10`, `0`, or `10` */
const roundThirds = (x: number): number => {
  return Math.max(-10, Math.min(10, 10 * Math.round(3 * x / 20)));
};

/** Updatable political compass graphic */
class PoliticalCompass extends HTMLElement {
  societyWeights?: Float32Array;
  economyWeights?: Float32Array;

  #politicalCompass: SVGSVGElement;
  #predictionMean: SVGElement;
  #confidenceRegion80: SVGElement;
  #confidenceRegion95: SVGElement;
  #isBeingDragged = false;

  // Prediction data for re-classification
  #sampleFeatureVectors: Set<number>[] = [];
  #societyPredictions: Prediction[] = [];
  #economyPredictions: Prediction[] = [];
  #previousSocietyWeights = new Float32Array();
  #previousEconomyWeights = new Float32Array();

  /** Used as unique identifier for texts */
  #previousTextsHash = NaN;

  constructor() {
    super();

    // Parent element of the visual
    this.#politicalCompass = accessibleSvgElementFactory(
      POLITICAL_COMPASS_ATTRIBUTES,
    ) as SVGSVGElement;

    // Colorful quadrants
    this.#politicalCompass.appendChild(svgElementFactory(Q1_ATTRIBUTES));
    this.#politicalCompass.appendChild(svgElementFactory(Q2_ATTRIBUTES));
    this.#politicalCompass.appendChild(svgElementFactory(Q3_ATTRIBUTES));
    this.#politicalCompass.appendChild(svgElementFactory(Q4_ATTRIBUTES));

    // Confidence regions and mean
    this.#confidenceRegion95 = accessibleSvgElementFactory(
      CONFIDENCE_REGION_95_ATTRIBUTES,
    );
    this.#politicalCompass.appendChild(this.#confidenceRegion95);
    this.#confidenceRegion80 = accessibleSvgElementFactory(
      CONFIDENCE_REGION_80_ATTRIBUTES,
    );
    this.#politicalCompass.appendChild(this.#confidenceRegion80);
    this.#predictionMean = accessibleSvgElementFactory(
      PREDICTION_MEAN_ATTRIBUTES,
    );
    this.#politicalCompass.appendChild(this.#predictionMean);

    // Drag events for re-classification
    this.#predictionMean.addEventListener("pointerdown", () => {
      this.#isBeingDragged = true;
    });
    this.#politicalCompass.addEventListener("pointermove", (event) => {
      this.#onPointerMove(event);
    });
    this.#predictionMean.addEventListener("pointerup", (event) => {
      this.#onPointerUp(event);
    });

    this.attachShadow({ mode: "open" }).append(this.#politicalCompass);
  }

  /** Compute the political compass confidence region for an `Array` of texts */
  computeConfidenceRegion(texts: string[]): void {
    if (!this.societyWeights || !this.economyWeights) {
      console.warn("One or both of the weights has not been set");
      return;
    }

    // Remove ellipses and prediction mean
    if (texts.length === 0) {
      console.warn("Cannot compute confidence with texts.length of 0");
      this.#confidenceRegion95.setAttribute("visibility", "hidden");
      this.#confidenceRegion80.setAttribute("visibility", "hidden");
      this.#predictionMean.setAttribute("visibility", "hidden");
      return;
    }

    // Calculate probabilities and predictions
    this.#sampleFeatureVectors = [];
    const societyProbabilities: number[] = [];
    this.#societyPredictions = [];
    const economyProbabilities: number[] = [];
    this.#economyPredictions = [];
    let textsHash = 0;
    for (const text of texts) {
      const x = vectorize(text);
      this.#sampleFeatureVectors.push(x);

      const societyProbability = probability(x, this.societyWeights!);
      societyProbabilities.push(societyProbability);
      this.#societyPredictions.push(predict(societyProbability));

      const economyProbability = probability(x, this.economyWeights!);
      economyProbabilities.push(economyProbability);
      this.#economyPredictions.push(predict(economyProbability));

      x.forEach((i) => {
        textsHash += i;
      });
    }

    // Save references to previous weights in case of re-re-classification
    if (textsHash !== this.#previousTextsHash) {
      this.#previousSocietyWeights = this.societyWeights;
      this.#previousEconomyWeights = this.economyWeights;
      this.#previousTextsHash = textsHash;
    }

    const societyMean = 10 * mean(societyProbabilities);
    const societyMoe80 = Math.max(
      1.0,
      10 * marginOfError(societyProbabilities, 0.2),
    );
    const societyMoe95 = Math.max(
      1.5,
      10 * marginOfError(societyProbabilities, 0.05),
    );

    const economyMean = 10 * mean(economyProbabilities);
    const economyMoe80 = Math.max(
      1.0,
      10 * marginOfError(economyProbabilities, 0.2),
    );
    const economyMoe95 = Math.max(
      1.5,
      10 * marginOfError(economyProbabilities, 0.05),
    );

    this.#renderConfidenceRegion({
      confidenceRegion: this.#confidenceRegion80,
      interval: "80%",
      societyMean,
      economyMean,
      societyMoe: societyMoe80,
      economyMoe: economyMoe80,
    });
    this.#renderConfidenceRegion({
      confidenceRegion: this.#confidenceRegion95,
      interval: "95%",
      societyMean,
      economyMean,
      societyMoe: societyMoe95,
      economyMoe: economyMoe95,
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
    const societyLowerBound = Math.round(societyMean - societyMoe);
    const societyUpperBound = Math.round(societyMean + societyMoe);
    const economyLowerBound = Math.round(economyMean - economyMoe);
    const economyUpperBound = Math.round(economyMean + economyMoe);
    const desc = confidenceRegion.children[1] as HTMLElement;
    desc.innerText =
      `Society axis ${interval} confidence interval between ${societyLowerBound} and ${societyUpperBound};\
      economy axis ${interval} confidence interval  between ${economyLowerBound} and ${economyUpperBound}`;

    // The SVG is given using center and radiuses
    confidenceRegion.setAttribute("cx", societyMean + "");
    confidenceRegion.setAttribute("cy", -economyMean + ""); // inversed
    confidenceRegion.setAttribute("rx", societyMoe + "");
    confidenceRegion.setAttribute("ry", economyMoe + "");
    confidenceRegion.setAttribute("visibility", "visible");
  }

  /** Update the svg showing the sample mean */
  #setPredictionMean(
    { societyMean, economyMean }: Record<string, number>,
  ): void {
    // Standard scores for accessability in [-10, 10]
    const desc = this.#predictionMean.children[1] as HTMLElement;
    const societyMeanPrediction = Math.round(societyMean);
    const economyMeanPrediction = Math.round(economyMean);
    desc.innerText = `Society mean prediction of ${societyMeanPrediction};\
      economy axis mean prediction of ${economyMeanPrediction}`;

    // The SVG is given using center
    this.#predictionMean.setAttribute("cx", societyMean + "");
    this.#predictionMean.setAttribute("cy", -economyMean + ""); //inversed
    this.#predictionMean.setAttribute("visibility", "visible");
  }

  /** Returns the svg coordinates for a `PointerEvent` */
  computeSvgPoint(event: PointerEvent): DOMPoint {
    const domPoint = this.#politicalCompass.createSVGPoint();
    domPoint.x = event.clientX;
    domPoint.y = event.clientY;
    const domMatrix = this.#politicalCompass.getScreenCTM()!.inverse();
    const svgPoint = domPoint.matrixTransform(domMatrix);
    return svgPoint;
  }

  /** Places confidence regions evenly and prediction mean follows cursor */
  #onPointerMove = (event: PointerEvent): void => {
    if (!this.#isBeingDragged) {
      return;
    }
    const { x, y } = this.computeSvgPoint(event);
    this.#predictionMean.setAttribute("cx", x + "");
    this.#predictionMean.setAttribute("cy", y + "");
    this.#moveToThirds(x, y);
  };

  /** Places confidence regions and prediction mean evenly */
  #onPointerUp = (event: PointerEvent): void => {
    console.debug("Pointer up");

    // TODO: more accessability for this feature
    this.#isBeingDragged = false;
    const { x, y } = this.computeSvgPoint(event);
    this.#predictionMean.setAttribute("cx", roundThirds(x) + "");
    this.#predictionMean.setAttribute("cy", roundThirds(y) + "");
    this.#moveToThirds(x, y);
    this.#predictionMean.blur();

    // Train society on re-classified samples
    const societyYTrue = -roundThirds(x) / 10 as 0 | Prediction; // inversed
    const societySamples = this.#sampleFeatureVectors.map((x, i) => {
      const societyYHat = this.#societyPredictions[i];
      const y = societyYTrue === 0 ? -societyYHat as Prediction : societyYTrue;
      return { x, y, weight: 1 };
    });
    this.societyWeights = partialFit(
      societySamples,
      this.#previousSocietyWeights,
    );

    // Train economy on re-classified samples
    const economyYTrue = roundThirds(y) / 10 as 0 | Prediction; // inversed
    const economySamples = this.#sampleFeatureVectors.map((x, i) => {
      const economyYHat = this.#economyPredictions[i];
      const y = economyYTrue === 0 ? -economyYHat as Prediction : economyYTrue;
      return { x, y, weight: 1 };
    });
    console.log(economyYTrue, economySamples);
    this.economyWeights = partialFit(
      economySamples,
      this.#previousEconomyWeights,
    );

    // Send event to potentially save new weights
    console.debug("Sending weightsupdate event");
    const weightsUpdateEvent = new CustomEvent("weightsupdate", {
      detail: {
        societyWeights: this.societyWeights,
        economyWeights: this.economyWeights,
      },
    });
    console.log(societyYTrue, societySamples);
    this.dispatchEvent(weightsUpdateEvent);
  };

  /** Moves confidence regions to even positions */
  #moveToThirds = (x: number, y: number): void => {
    const cx = roundThirds(x) + "";
    const cy = roundThirds(y) + "";
    this.#confidenceRegion80.setAttribute("cx", cx);
    this.#confidenceRegion80.setAttribute("cy", cy);
    this.#confidenceRegion95.setAttribute("cx", cx);
    this.#confidenceRegion95.setAttribute("cy", cy);
  };
}

customElements.define("political-compass", PoliticalCompass);
