/// <reference lib="dom" />

import { vectorize } from "./vectorize.ts";
import { partialFit, predict, probability } from "./binary_classifier.ts";
import { marginOfError, mean } from "./statistics.ts";
import { Prediction } from "./types.ts";

// TODO: max and min of -10/10
// TODO: separate `isBeingMoved` with mouse vs keyboard
// TODO: Update mean prediction `desc` when `#onPointerUp` is called
// TODO: Remove usage of getBoundingClientRect by making event optional - use svg coordinates

/** Attributes for the parent SVG element */
const POLITICAL_COMPASS_ATTRIBUTES = {
  tabindex: "0",
  tagName: "svg",
  idPrefix: "political-compass",
  titleText: "Political Compass",
  descText: "Visual that places samples of text on the political compass",
  viewBox: "-10 -10 20 20",
  role: "img",
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
  style: "fill: lightGray; opacity: 60%; outline: none",
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
  style: "fill: gray; opacity: 60%; outline: none",
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
  r: "1",
  visibility: "hidden", // Only shown on prediction
  style: "outline: none",
};

const SCREEN_READER_ONLY_STYLE =
  "position: absolute; height: 1px; width: 1px; overflow: hidden; clip: rect(1px, 1px, 1px, 1px)";

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
  #predictionMean: SVGCircleElement;
  #confidenceRegion80: SVGEllipseElement;
  #confidenceRegion95: SVGEllipseElement;
  #isBeingMoved = false;

  // Prediction data for re-classification
  #sampleFeatureVectors?: Set<number>[];
  #societyPredictions?: number[];
  #economyPredictions?: number[];
  #previousSocietyWeights?: Float32Array;
  #previousEconomyWeights?: Float32Array;

  /** Used as unique identifier for texts */
  #previousTextsHash?: number;

  #screenReaderOnly: HTMLElement;

  constructor() {
    super();

    //Add accessible political compass SVG visual
    [
      this.#politicalCompass,
      this.#confidenceRegion95,
      this.#confidenceRegion80,
      this.#predictionMean,
    ] = this.#renderPoliticalCompass();

    // Non-visible text to describe navigation
    this.#screenReaderOnly = document.createElement("tspan");
    this.#screenReaderOnly.setAttribute("style", SCREEN_READER_ONLY_STYLE);
    this.#screenReaderOnly.setAttribute("aria-live", "polite");

    this.attachShadow({ mode: "open" }).append(
      this.#politicalCompass,
      this.#screenReaderOnly,
    );
  }

  /** Renders political the political compass and returns its components */
  #renderPoliticalCompass(): [
    SVGSVGElement,
    SVGEllipseElement,
    SVGEllipseElement,
    SVGCircleElement,
  ] {
    const politicalCompass = accessibleSvgElementFactory(
      POLITICAL_COMPASS_ATTRIBUTES,
    ) as SVGSVGElement;

    politicalCompass.appendChild(svgElementFactory(Q1_ATTRIBUTES));
    politicalCompass.appendChild(svgElementFactory(Q2_ATTRIBUTES));
    politicalCompass.appendChild(svgElementFactory(Q3_ATTRIBUTES));
    politicalCompass.appendChild(svgElementFactory(Q4_ATTRIBUTES));

    const [
      confidenceRegion95,
      confidenceRegion80,
    ] = this.#renderConfidenceRegions(politicalCompass);

    const predictionMean = this.#renderPredictionMean(politicalCompass);

    return [
      politicalCompass,
      confidenceRegion95,
      confidenceRegion80,
      predictionMean,
    ];
  }

  /** Renders confidence regions to the political compass */
  #renderConfidenceRegions(
    politicalCompass: SVGSVGElement,
  ): [SVGEllipseElement, SVGEllipseElement] {
    const confidenceRegion95 = accessibleSvgElementFactory(
      CONFIDENCE_REGION_95_ATTRIBUTES,
    ) as SVGEllipseElement;

    politicalCompass.appendChild(confidenceRegion95);

    const confidenceRegion80 = accessibleSvgElementFactory(
      CONFIDENCE_REGION_80_ATTRIBUTES,
    ) as SVGEllipseElement;

    politicalCompass.appendChild(confidenceRegion80);

    return [confidenceRegion95, confidenceRegion80];
  }

  /** Renders prediction mean on the political compass */
  #renderPredictionMean(politicalCompass: SVGSVGElement): SVGCircleElement {
    const predictionMean = accessibleSvgElementFactory(
      PREDICTION_MEAN_ATTRIBUTES,
    ) as SVGCircleElement;

    politicalCompass.appendChild(predictionMean);

    predictionMean.addEventListener("pointerdown", this.#onPointerDown);
    document.addEventListener("pointermove", this.#onPointerMove);
    document.addEventListener("pointerup", this.#onPointerUp);
    politicalCompass.addEventListener("keydown", this.#onKeyDown);

    return predictionMean;
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

    // Calculate probabilities
    this.#sampleFeatureVectors = texts.map((text) => vectorize(text));
    const societyProbabilities = this.#sampleFeatureVectors.map((x) => {
      return probability(x, this.societyWeights!);
    });
    const economyProbabilities = this.#sampleFeatureVectors.map((x) => {
      return probability(x, this.economyWeights!);
    });

    // Save references to previous weights in case of re-re-classification
    const currentTextsHash = this.#computeCurrentTextsHash();
    if (currentTextsHash !== this.#previousTextsHash) {
      this.#previousSocietyWeights = this.societyWeights;
      this.#previousEconomyWeights = this.economyWeights;
      this.#societyPredictions = societyProbabilities.map((yHat) => {
        return predict(yHat);
      });
      this.#economyPredictions = economyProbabilities.map((yHat) => {
        return predict(yHat);
      });
      this.#previousTextsHash = currentTextsHash;
    }

    const societyMean = 10 * mean(societyProbabilities);
    const societyMoe80 = Math.max(
      1.5,
      10 * marginOfError(societyProbabilities, 0.2),
    );
    const societyMoe95 = Math.max(
      2.0,
      10 * marginOfError(societyProbabilities, 0.05),
    );

    const economyMean = 10 * mean(economyProbabilities);
    const economyMoe80 = Math.max(
      1.5,
      10 * marginOfError(economyProbabilities, 0.2),
    );
    const economyMoe95 = Math.max(
      2.0,
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

  /** Computes the not quite unique identifier of the texts */
  #computeCurrentTextsHash(): number {
    let textsHash = 0;
    this.#sampleFeatureVectors!.forEach((x) => {
      x.forEach((i) => {
        textsHash += i;
      });
    });
    return textsHash;
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
    this.#screenReaderOnly.innerText = "Political compass visual updated";
    desc.innerText = `Society mean prediction of ${societyMeanPrediction};\
      economy axis mean prediction of ${economyMeanPrediction};\
      use W A S D, arrow keys, or drag to adjust this prediction`;

    // The SVG is given using center
    this.#predictionMean.setAttribute("cx", societyMean + "");
    this.#predictionMean.setAttribute("cy", -economyMean + ""); //inversed
    this.#predictionMean.setAttribute("visibility", "visible");
  }

  /** Returns the center dom coordinates of the mean prediction point */
  #computeMeanPredictionPoint(): { clientX: number; clientY: number } {
    const bounds = this.#predictionMean.getBoundingClientRect();
    const clientX = bounds.x + bounds.width / 2;
    const clientY = bounds.y + bounds.height / 2;
    return { clientX, clientY };
  }

  /** Returns the SVG coordinates for a `PointerEvent` */
  computeSvgPoint(event: PointerEvent): DOMPoint {
    const domPoint = this.#politicalCompass.createSVGPoint();
    domPoint.x = event.clientX;
    domPoint.y = event.clientY;
    const domMatrix = this.#politicalCompass.getScreenCTM()!.inverse();
    const svgPoint = domPoint.matrixTransform(domMatrix);
    return svgPoint;
  }

  /** Used when beginning to drag prediction mean */
  #onPointerDown = (): void => {
    this.#isBeingMoved = true;
  };

  /** Places confidence regions evenly and prediction mean follows cursor */
  #onPointerMove = (event: PointerEvent): void => {
    if (!this.#isBeingMoved) {
      return;
    }

    const { x, y } = this.computeSvgPoint(event);
    this.#predictionMean.setAttribute("cx", x + "");
    this.#predictionMean.setAttribute("cy", y + "");

    // Update SROnly for immediate notification and desc if they come back to it
    const desc = this.#predictionMean.children[1] as HTMLElement;
    const societyMeanPrediction = roundThirds(x);
    const economyMeanPrediction = roundThirds(y);
    desc.innerText = this.#screenReaderOnly.innerText =
      `Selecting society mean prediction of ${societyMeanPrediction};\
      economy axis mean prediction of ${-economyMeanPrediction};\
      use the enter key to confirm this update`;

    this.#moveConfidenceRegionsToThirds(x, y);
  };

  /** Places confidence regions and prediction mean evenly */
  #onPointerUp = (event: PointerEvent): void => {
    if (!this.#isBeingMoved) {
      return;
    }

    console.debug("Placing new prediction mean");

    // End drag
    this.#isBeingMoved = false;

    // Adjust user interface
    const { x, y } = this.computeSvgPoint(event);
    this.#movePredictionMeanToThirds(x, y);
    this.#moveConfidenceRegionsToThirds(x, y);

    const desc = this.#predictionMean.children[1] as HTMLElement;
    const societyMeanPrediction = roundThirds(x);
    const economyMeanPrediction = roundThirds(y);
    desc.innerText = this.#screenReaderOnly.innerText =
      `Adjusted society mean prediction to ${societyMeanPrediction};\
      economy axis mean prediction to ${-economyMeanPrediction};\
      use W A S D, arrow keys, or drag to adjust this prediction`;

    // Train society on re-classified samples
    const societyYTrue = -roundThirds(x) / 10 as 0 | Prediction; // inversed
    const societySamples = this.#sampleFeatureVectors!.map((x, i) => {
      const societyYHat = this.#societyPredictions![i];
      const y = societyYTrue === 0 ? -societyYHat as Prediction : societyYTrue;
      return { x, y, weight: 1 };
    });
    this.societyWeights = partialFit(
      societySamples,
      this.#previousSocietyWeights!,
    );

    // Train economy on re-classified samples
    const economyYTrue = roundThirds(y) / 10 as 0 | Prediction; // inversed
    const economySamples = this.#sampleFeatureVectors!.map((x, i) => {
      const economyYHat = this.#economyPredictions![i];
      const y = economyYTrue === 0 ? -economyYHat as Prediction : economyYTrue;
      return { x, y, weight: 1 };
    });
    this.economyWeights = partialFit(
      economySamples,
      this.#previousEconomyWeights!,
    );

    // Send event to potentially save new weights
    console.debug("Sending weightsupdate event");
    const weightsUpdateEvent = new CustomEvent("weightsupdate", {
      detail: {
        societyWeights: this.societyWeights,
        economyWeights: this.economyWeights,
      },
    });
    this.dispatchEvent(weightsUpdateEvent);
  };

  /** Used as alternative to dragging prediction mean */
  #onKeyDown = (keyboardEvent: KeyboardEvent): void => {
    // Casts the KeyboardEvent to a PointerEvent
    let cx = +this.#predictionMean.getAttribute("cx")!;
    let cy = +this.#predictionMean.getAttribute("cy")!;
    switch (keyboardEvent.key) {
      case "Up":
      case "ArrowUp":
      case "W":
      case "w":
        cy -= 10;
        break;
      case "Left":
      case "ArrowLeft":
      case "A":
      case "a":
        cx -= 10;
        break;
      case "Down":
      case "ArrowDown":
      case "S":
      case "s":
        cy += 10;
        break;
      case "Right":
      case "ArrowRight":
      case "D":
      case "d":
        cx += 10;
        break;
      case "Enter": {
        const pointerEvent = new PointerEvent(
          "pointerup",
          this.#computeMeanPredictionPoint(),
        );
        this.#onPointerUp(pointerEvent);
        return;
      }
      default:
        return;
    }
    this.#isBeingMoved = true;
    this.#movePredictionMeanToThirds(cx, cy);
    const pointerEvent = new PointerEvent(
      "pointermove",
      this.#computeMeanPredictionPoint(),
    );
    this.#onPointerMove(pointerEvent);
  };

  /** Moves prediction mean to even position */
  #movePredictionMeanToThirds = (x: number, y: number): void => {
    const societyMeanPrediction = roundThirds(x);
    const economyMeanPrediction = roundThirds(y);
    this.#predictionMean.setAttribute("cx", societyMeanPrediction + "");
    this.#predictionMean.setAttribute("cy", economyMeanPrediction + "");
    (this.#confidenceRegion80.children[1] as HTMLElement).innerText =
      "80% confidence region";
    (this.#confidenceRegion95.children[1] as HTMLElement).innerText =
      "95% confidence region";
  };

  /** Moves confidence regions to even positions */
  #moveConfidenceRegionsToThirds = (x: number, y: number): void => {
    const cx = roundThirds(x) + "";
    const cy = roundThirds(y) + "";
    this.#confidenceRegion80.setAttribute("cx", cx);
    this.#confidenceRegion80.setAttribute("cy", cy);
    this.#confidenceRegion95.setAttribute("cx", cx);
    this.#confidenceRegion95.setAttribute("cy", cy);
  };
}

customElements.define("political-compass", PoliticalCompass);
