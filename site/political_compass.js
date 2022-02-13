// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const C1 = 3432918353;
const C2 = 461845907;
const R1 = 15;
const R2 = 13;
const M = 5;
const N = 3864292196;
const rotateLeft = (m, n)=>{
    return m << n | m >>> 32 - n;
};
const hash = (key)=>{
    let hash1 = 0;
    const remainingBytes = key.length % 4;
    const fourByteChunks = key.length - remainingBytes;
    let i = 0;
    for(; i < fourByteChunks; i += 4){
        let k = (key.charCodeAt(i) & 255) + ((key.charCodeAt(i + 1) & 255) << 8) + ((key.charCodeAt(i + 2) & 255) << 16) + ((key.charCodeAt(i + 3) & 255) << 24);
        k = Math.imul(k, C1);
        k = rotateLeft(k, R1);
        k = Math.imul(k, C2);
        hash1 ^= k;
        hash1 = rotateLeft(hash1, R2);
        hash1 = Math.imul(hash1, M) + N;
    }
    let k = 0;
    switch(remainingBytes){
        case 3:
            k |= (key.charCodeAt(i + 2) & 255) << 16;
        case 2:
            k |= (key.charCodeAt(i + 1) & 255) << 8;
        case 1:
            k |= key.charCodeAt(i) & 255;
            k = Math.imul(k, C1);
            k = rotateLeft(k, R1);
            k = Math.imul(k, C2);
            hash1 ^= k;
    }
    hash1 ^= key.length;
    hash1 ^= hash1 >>> 16;
    hash1 = Math.imul(hash1, 2246822507);
    hash1 ^= hash1 >>> 13;
    hash1 = Math.imul(hash1, 3266489909);
    hash1 ^= hash1 >>> 16;
    return hash1 >>> 0;
};
const N_FEATURES = 2 ** 16;
const TOKEN_PATTERN = /\b\w\w+\b/gu;
const stripAccents = (text)=>{
    return text.normalize("NFKD").replace(/\p{Diacritic}/gu, "");
};
const preprocess = (text)=>{
    return stripAccents(text.toLowerCase());
};
const vectorize = (text)=>{
    const indices = new Set();
    for (const [token] of preprocess(text).matchAll(TOKEN_PATTERN)){
        const i = hash(token) % N_FEATURES;
        indices.add(i);
    }
    return indices;
};
const loss = (p, y)=>{
    const z = p * y;
    if (z >= 1) {
        return 0;
    } else if (z >= -1) {
        return (1 - z) * (1 - z);
    } else {
        return -4 * z;
    }
};
const dLoss = (p, y)=>{
    const z = p * y;
    if (z >= 1) {
        return 0;
    } else if (z >= -1) {
        return 2 * (1 - z) * -y;
    } else {
        return -4 * y;
    }
};
const LEARNING_RATE = 0.001;
const partialFit = (samples, weights)=>{
    let beta = 0;
    const u = weights.slice();
    const uHat = weights.slice();
    let sumLoss = 0;
    for (const { x , y , weight: weight1  } of samples){
        let p = 0;
        x.forEach((i)=>{
            p += u[i];
        });
        sumLoss += loss(p, y);
        beta++;
        const g = dLoss(p, y);
        x.forEach((i)=>{
            u[i] -= g * LEARNING_RATE * weight1;
            uHat[i] += g * beta * LEARNING_RATE * weight1;
        });
    }
    const averageLoss = (sumLoss / samples.length).toFixed(4);
    console.info(`Partial fit - Average loss: ${averageLoss}`);
    return u.map((weight, i)=>(weight + uHat[i]) / beta
    );
};
function predict(x, weights) {
    if (typeof x === "number") {
        return x > 0 ? 1 : -1;
    } else if (x instanceof Set && weights) {
        return probability(x, weights) > 0 ? 1 : -1;
    } else {
        throw new RangeError(`Invalid types for predict: ${x}, ${weights}`);
    }
}
const probability = (x, weights)=>{
    let prob = 0;
    x.forEach((i)=>{
        prob += weights[i];
    });
    return prob;
};
const T_DISTRIBUTION_TABLE = [
    {
        i: 0,
        0.2: 10,
        0.05: 10
    },
    {
        i: 1,
        0.2: 3.078,
        0.05: 12.71
    },
    {
        i: 2,
        0.2: 1.886,
        0.05: 4.303
    },
    {
        i: 3,
        0.2: 1.638,
        0.05: 3.182
    },
    {
        i: 4,
        0.2: 1.533,
        0.05: 2.776
    },
    {
        i: 5,
        0.2: 1.476,
        0.05: 2.571
    },
    {
        i: 6,
        0.2: 1.44,
        0.05: 2.447
    },
    {
        i: 7,
        0.2: 1.415,
        0.05: 2.365
    },
    {
        i: 8,
        0.2: 1.397,
        0.05: 2.306
    },
    {
        i: 9,
        0.2: 1.383,
        0.05: 2.262
    },
    {
        i: 10,
        0.2: 1.372,
        0.05: 2.228
    },
    {
        i: 11,
        0.2: 1.363,
        0.05: 2.201
    },
    {
        i: 12,
        0.2: 1.356,
        0.05: 2.179
    },
    {
        i: 13,
        0.2: 1.35,
        0.05: 2.16
    },
    {
        i: 14,
        0.2: 1.345,
        0.05: 2.145
    },
    {
        i: 15,
        0.2: 1.341,
        0.05: 2.131
    },
    {
        i: 16,
        0.2: 1.337,
        0.05: 2.12
    },
    {
        i: 17,
        0.2: 1.333,
        0.05: 2.11
    },
    {
        i: 18,
        0.2: 1.33,
        0.05: 2.101
    },
    {
        i: 19,
        0.2: 1.328,
        0.05: 2.093
    },
    {
        i: 20,
        0.2: 1.325,
        0.05: 2.086
    },
    {
        i: 21,
        0.2: 1.323,
        0.05: 2.08
    },
    {
        i: 22,
        0.2: 1.321,
        0.05: 2.074
    },
    {
        i: 23,
        0.2: 1.319,
        0.05: 2.069
    },
    {
        i: 24,
        0.2: 1.318,
        0.05: 2.064
    },
    {
        i: 25,
        0.2: 1.316,
        0.05: 2.06
    },
    {
        i: 26,
        0.2: 1.315,
        0.05: 2.056
    },
    {
        i: 27,
        0.2: 1.314,
        0.05: 2.052
    },
    {
        i: 28,
        0.2: 1.313,
        0.05: 2.048
    },
    {
        i: 29,
        0.2: 1.311,
        0.05: 2.045
    },
    {
        i: 30,
        0.2: 1.31,
        0.05: 2.042
    },
    {
        i: 40,
        0.2: 1.303,
        0.05: 2.021
    },
    {
        i: 60,
        0.2: 1.296,
        0.05: 2
    },
    {
        i: 80,
        0.2: 1.292,
        0.05: 1.99
    },
    {
        i: 100,
        0.2: 1.29,
        0.05: 1.984
    },
    {
        i: 1000,
        0.2: 1.282,
        0.05: 1.962
    }, 
];
const tLookup = (degreesOfFreedom)=>{
    let l = 0;
    let r = T_DISTRIBUTION_TABLE.length - 1;
    while(l < r){
        const m = Math.floor((l + r) / 2);
        const index = T_DISTRIBUTION_TABLE[m].i;
        if (index < degreesOfFreedom) {
            l = m + 1;
        } else {
            r = m;
        }
    }
    return T_DISTRIBUTION_TABLE[l];
};
const mean = (samples)=>{
    return samples.reduce((a, b)=>a + b
    ) / samples.length;
};
const std = (samples)=>{
    if (samples.length < 2) {
        return 1;
    }
    const sampleMean = mean(samples);
    const sumSquaredError = samples.reduce((sum, sample)=>{
        const error = sample - sampleMean;
        const squaredError = error * error;
        return sum + squaredError;
    }, 0);
    const variance = sumSquaredError / (samples.length - 1);
    return variance ** 0.5;
};
const marginOfError = (samples, alpha)=>{
    const degreesOfFreedom = samples.length - 1;
    const tStatistic = tLookup(degreesOfFreedom)[alpha];
    const standardError = std(samples) / samples.length ** 0.5;
    const marginOfError1 = tStatistic * standardError;
    return marginOfError1;
};
const POLITICAL_COMPASS_ATTRIBUTES = {
    tabindex: "0",
    tagName: "svg",
    idPrefix: "political-compass",
    titleText: "Political Compass",
    descText: "Visual that places samples of text on the political compass",
    viewBox: "-10 -10 20 20",
    role: "img"
};
const Q2_ATTRIBUTES = {
    tagName: "rect",
    style: "fill: #fa7576",
    width: "10",
    height: "10",
    x: "-10",
    y: "-10"
};
const Q1_ATTRIBUTES = {
    tagName: "rect",
    style: "fill: #a0d5ff",
    width: "10",
    height: "10",
    x: "0",
    y: "-10"
};
const Q3_ATTRIBUTES = {
    tagName: "rect",
    style: "fill: #cdf6ca",
    width: "10",
    height: "10",
    x: "-10",
    y: "0"
};
const Q4_ATTRIBUTES = {
    tagName: "rect",
    style: "fill: #e0cdf5",
    width: "10",
    height: "10",
    x: "0",
    y: "0"
};
const CONFIDENCE_REGION_95_ATTRIBUTES = {
    role: "presentation",
    tabindex: "0",
    tagName: "ellipse",
    idPrefix: "confidence-region-95",
    titleText: "95% Confidence Interval",
    descText: "",
    style: "fill: lightGray; opacity: 60%; outline: none",
    visibility: "hidden"
};
const CONFIDENCE_REGION_80_ATTRIBUTES = {
    role: "presentation",
    tabindex: "0",
    tagName: "ellipse",
    idPrefix: "confidence-region-80",
    titleText: "80% Confidence Interval",
    descText: "",
    style: "fill: gray; opacity: 60%; outline: none",
    visibility: "hidden"
};
const PREDICTION_MEAN_ATTRIBUTES = {
    role: "presentation",
    tabindex: "0",
    tagName: "circle",
    idPrefix: "prediction-mean",
    titleText: "Prediction Mean",
    descText: "",
    fill: "black",
    r: "1",
    visibility: "hidden",
    style: "outline: none"
};
const SCREEN_READER_ONLY_STYLE = "position: absolute; height: 1px; width: 1px; overflow: hidden; clip: rect(1px, 1px, 1px, 1px)";
const svgElementFactory = ({ tagName , ...attributes })=>{
    const element = document.createElementNS("http://www.w3.org/2000/svg", tagName);
    for (const attribute of Object.entries(attributes)){
        element.setAttribute(...attribute);
    }
    return element;
};
const accessibleSvgElementFactory = ({ idPrefix , titleText , descText , ...attributes })=>{
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
const roundThirds = (x)=>{
    return Math.max(-10, Math.min(10, 10 * Math.round(3 * x / 20)));
};
class PoliticalCompass extends HTMLElement {
    societyWeights;
    economyWeights;
    #politicalCompass;
    #predictionMean;
    #confidenceRegion80;
    #confidenceRegion95;
    #isBeingMovedByMouse = false;
    #sampleFeatureVectors;
    #societyPredictions;
    #economyPredictions;
    #previousSocietyWeights;
    #previousEconomyWeights;
    #previousTextsHash;
    #screenReaderOnly;
    constructor(){
        super();
        [this.#politicalCompass, this.#confidenceRegion95, this.#confidenceRegion80, this.#predictionMean, ] = this.#renderPoliticalCompass();
        this.#screenReaderOnly = document.createElement("tspan");
        this.#screenReaderOnly.setAttribute("style", SCREEN_READER_ONLY_STYLE);
        this.#screenReaderOnly.setAttribute("aria-live", "polite");
        this.attachShadow({
            mode: "open"
        }).append(this.#politicalCompass, this.#screenReaderOnly);
    }
     #renderPoliticalCompass() {
        const politicalCompass = accessibleSvgElementFactory(POLITICAL_COMPASS_ATTRIBUTES);
        politicalCompass.appendChild(svgElementFactory(Q1_ATTRIBUTES));
        politicalCompass.appendChild(svgElementFactory(Q2_ATTRIBUTES));
        politicalCompass.appendChild(svgElementFactory(Q3_ATTRIBUTES));
        politicalCompass.appendChild(svgElementFactory(Q4_ATTRIBUTES));
        const [confidenceRegion95, confidenceRegion80, ] = this.#renderConfidenceRegions(politicalCompass);
        const predictionMean = this.#renderPredictionMean(politicalCompass);
        return [
            politicalCompass,
            confidenceRegion95,
            confidenceRegion80,
            predictionMean, 
        ];
    }
     #renderConfidenceRegions(politicalCompass) {
        const confidenceRegion95 = accessibleSvgElementFactory(CONFIDENCE_REGION_95_ATTRIBUTES);
        politicalCompass.appendChild(confidenceRegion95);
        const confidenceRegion80 = accessibleSvgElementFactory(CONFIDENCE_REGION_80_ATTRIBUTES);
        politicalCompass.appendChild(confidenceRegion80);
        return [
            confidenceRegion95,
            confidenceRegion80
        ];
    }
     #renderPredictionMean(politicalCompass1) {
        const predictionMean = accessibleSvgElementFactory(PREDICTION_MEAN_ATTRIBUTES);
        politicalCompass1.appendChild(predictionMean);
        predictionMean.addEventListener("pointerdown", this.#onPointerDown);
        document.addEventListener("pointermove", this.#onPointerMove);
        document.addEventListener("pointerup", this.#onPointerUp);
        politicalCompass1.addEventListener("keydown", this.#onKeyDown);
        return predictionMean;
    }
    computeConfidenceRegion(texts) {
        if (!this.societyWeights || !this.economyWeights) {
            console.warn("One or both of the weights has not been set");
            return;
        }
        if (texts.length === 0) {
            console.warn("Cannot compute confidence with texts.length of 0");
            this.#confidenceRegion95.setAttribute("visibility", "hidden");
            this.#confidenceRegion80.setAttribute("visibility", "hidden");
            this.#predictionMean.setAttribute("visibility", "hidden");
            return;
        }
        this.#sampleFeatureVectors = texts.map((text)=>vectorize(text)
        );
        const societyProbabilities = this.#sampleFeatureVectors.map((x)=>{
            return probability(x, this.societyWeights);
        });
        const economyProbabilities = this.#sampleFeatureVectors.map((x)=>{
            return probability(x, this.economyWeights);
        });
        const currentTextsHash = this.#computeCurrentTextsHash();
        if (currentTextsHash !== this.#previousTextsHash) {
            this.#previousSocietyWeights = this.societyWeights;
            this.#previousEconomyWeights = this.economyWeights;
            this.#societyPredictions = societyProbabilities.map((yHat)=>{
                return predict(yHat);
            });
            this.#economyPredictions = economyProbabilities.map((yHat)=>{
                return predict(yHat);
            });
            this.#previousTextsHash = currentTextsHash;
        }
        const societyMean = Math.min(10, Math.max(-10, 10 * mean(societyProbabilities)));
        const societyMoe80 = Math.max(1.5, 10 * marginOfError(societyProbabilities, 0.2));
        const societyMoe95 = Math.max(2, 10 * marginOfError(societyProbabilities, 0.05));
        const economyMean = Math.min(10, Math.max(-10, 10 * mean(economyProbabilities)));
        const economyMoe80 = Math.max(1.5, 10 * marginOfError(economyProbabilities, 0.2));
        const economyMoe95 = Math.max(2, 10 * marginOfError(economyProbabilities, 0.05));
        this.#renderConfidenceRegion({
            confidenceRegion: this.#confidenceRegion80,
            interval: "80%",
            societyMean,
            economyMean,
            societyMoe: societyMoe80,
            economyMoe: economyMoe80
        });
        this.#renderConfidenceRegion({
            confidenceRegion: this.#confidenceRegion95,
            interval: "95%",
            societyMean,
            economyMean,
            societyMoe: societyMoe95,
            economyMoe: economyMoe95
        });
        this.#setPredictionMean({
            societyMean,
            economyMean
        });
    }
     #computeCurrentTextsHash() {
        let textsHash = 0;
        this.#sampleFeatureVectors.forEach((x)=>{
            x.forEach((i)=>{
                textsHash += i;
            });
        });
        return textsHash;
    }
     #renderConfidenceRegion({ confidenceRegion , interval , societyMean , economyMean , societyMoe , economyMoe  }) {
        const societyLowerBound = Math.round(societyMean - societyMoe);
        const societyUpperBound = Math.round(societyMean + societyMoe);
        const economyLowerBound = Math.round(economyMean - economyMoe);
        const economyUpperBound = Math.round(economyMean + economyMoe);
        const desc = confidenceRegion.children[1];
        desc.innerText = `Society axis ${interval} confidence interval between ${societyLowerBound} and ${societyUpperBound};\
      economy axis ${interval} confidence interval  between ${economyLowerBound} and ${economyUpperBound}`;
        confidenceRegion.setAttribute("cx", societyMean + "");
        confidenceRegion.setAttribute("cy", -economyMean + "");
        confidenceRegion.setAttribute("rx", societyMoe + "");
        confidenceRegion.setAttribute("ry", economyMoe + "");
        confidenceRegion.setAttribute("visibility", "visible");
    }
     #setPredictionMean({ societyMean: societyMean1 , economyMean: economyMean1  }) {
        const desc = this.#predictionMean.children[1];
        const societyMeanPrediction = Math.round(societyMean1);
        const economyMeanPrediction = Math.round(economyMean1);
        this.#screenReaderOnly.innerText = "Political compass visual updated";
        desc.innerText = `Society mean prediction of ${societyMeanPrediction};\
      economy axis mean prediction of ${economyMeanPrediction};\
      use W A S D, arrow keys, or drag to adjust this prediction`;
        this.#predictionMean.setAttribute("cx", societyMean1 + "");
        this.#predictionMean.setAttribute("cy", -economyMean1 + "");
        this.#predictionMean.setAttribute("visibility", "visible");
    }
    computeSvgPoint(event) {
        if (event) {
            const domPoint = this.#politicalCompass.createSVGPoint();
            domPoint.x = event.clientX;
            domPoint.y = event.clientY;
            const domMatrix = this.#politicalCompass.getScreenCTM().inverse();
            const svgPoint = domPoint.matrixTransform(domMatrix);
            return svgPoint;
        } else {
            const svgPoint = this.#politicalCompass.createSVGPoint();
            svgPoint.x = +this.#predictionMean.getAttribute("cx");
            svgPoint.y = +this.#predictionMean.getAttribute("cy");
            return svgPoint;
        }
    }
    #onPointerDown = ()=>{
        this.#isBeingMovedByMouse = true;
    };
    #onPointerMove = (event)=>{
        if (!this.#isBeingMovedByMouse) {
            return;
        }
        const { x , y  } = this.computeSvgPoint(event);
        this.#predictionMean.setAttribute("cx", x + "");
        this.#predictionMean.setAttribute("cy", y + "");
        const desc = this.#predictionMean.children[1];
        const societyMeanPrediction = roundThirds(x);
        const economyMeanPrediction = roundThirds(y);
        desc.innerText = this.#screenReaderOnly.innerText = `Selecting society mean prediction of ${societyMeanPrediction};\
      economy axis mean prediction of ${-economyMeanPrediction};\
      release pointer to select this adjustment`;
        this.#moveConfidenceRegionsToThirds(x, y);
    };
    #onPointerUp = (event)=>{
        const isBeingMovedByKeyBoard = !event;
        if (!this.#isBeingMovedByMouse && !isBeingMovedByKeyBoard) {
            return;
        }
        this.#isBeingMovedByMouse = false;
        console.debug("Placing new prediction mean");
        const { x: x1 , y: y1  } = this.computeSvgPoint(event);
        this.#movePredictionMeanToThirds(x1, y1);
        this.#moveConfidenceRegionsToThirds(x1, y1);
        const desc = this.#predictionMean.children[1];
        const societyMeanPrediction = roundThirds(x1);
        const economyMeanPrediction = roundThirds(y1);
        desc.innerText = this.#screenReaderOnly.innerText = `Adjusted society mean prediction to ${societyMeanPrediction};\
      economy axis mean prediction to ${-economyMeanPrediction};\
      use W A S D, arrow keys, or drag to adjust this prediction`;
        const societyYTrue = -roundThirds(x1) / 10;
        const societySamples = this.#sampleFeatureVectors.map((x, i)=>{
            const societyYHat = this.#societyPredictions[i];
            const y = societyYTrue === 0 ? -societyYHat : societyYTrue;
            return {
                x,
                y,
                weight: 1
            };
        });
        this.societyWeights = partialFit(societySamples, this.#previousSocietyWeights);
        const economyYTrue = roundThirds(y1) / 10;
        const economySamples = this.#sampleFeatureVectors.map((x, i)=>{
            const economyYHat = this.#economyPredictions[i];
            const y = economyYTrue === 0 ? -economyYHat : economyYTrue;
            return {
                x,
                y,
                weight: 1
            };
        });
        this.economyWeights = partialFit(economySamples, this.#previousEconomyWeights);
        console.debug("Sending weightsupdate event");
        const weightsUpdateEvent = new CustomEvent("weightsupdate", {
            detail: {
                societyWeights: this.societyWeights,
                economyWeights: this.economyWeights
            }
        });
        this.dispatchEvent(weightsUpdateEvent);
    };
    #onKeyDown = (keyboardEvent)=>{
        let cx = +this.#predictionMean.getAttribute("cx");
        let cy = +this.#predictionMean.getAttribute("cy");
        switch(keyboardEvent.key){
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
            default:
                return;
        }
        this.#predictionMean.setAttribute("cx", cx + "");
        this.#predictionMean.setAttribute("cy", cy + "");
        this.#onPointerUp();
    };
    #movePredictionMeanToThirds = (x, y)=>{
        const societyMeanPrediction = roundThirds(x);
        const economyMeanPrediction = roundThirds(y);
        this.#predictionMean.setAttribute("cx", societyMeanPrediction + "");
        this.#predictionMean.setAttribute("cy", economyMeanPrediction + "");
        this.#confidenceRegion80.children[1].innerText = "80% confidence region";
        this.#confidenceRegion95.children[1].innerText = "95% confidence region";
    };
    #moveConfidenceRegionsToThirds = (x, y)=>{
        const cx = roundThirds(x) + "";
        const cy = roundThirds(y) + "";
        this.#confidenceRegion80.setAttribute("cx", cx);
        this.#confidenceRegion80.setAttribute("cy", cy);
        this.#confidenceRegion95.setAttribute("cx", cx);
        this.#confidenceRegion95.setAttribute("cy", cy);
    };
}
customElements.define("political-compass", PoliticalCompass);
