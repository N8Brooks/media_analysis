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
const TOKEN_PATTERN = /\b\w\w+\b/gu;
const N_FEATURES = 2 ** 16;
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
const probability = (x, weights)=>{
    let prob = 0;
    x.forEach((i)=>{
        prob += weights[i];
    });
    return Math.min(1, Math.max(-1, prob));
};
const T_DISTRIBUTION_TABLE = [
    {
        i: 0,
        0.2: NaN,
        0.05: NaN
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
    let r = T_DISTRIBUTION_TABLE.length;
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
const POINT_ATTRIBUTES = {
    cx: "50%",
    cy: "50%",
    fill: "Black",
    r: "2%"
};
const CONFIDENCE_REGION_80_ATTRIBUTES = {
    cx: "50%",
    cy: "50%",
    rx: `${5}%`,
    ry: `${5}%`
};
const CONFIDENCE_REGION_80_STYLE = "fill: Gray; opacity: 60%";
const CONFIDENCE_REGION_95_ATTRIBUTES = {
    cx: "50%",
    cy: "50%",
    rx: `${10}%`,
    ry: `${10}%`
};
const CONFIDENCE_REGION_95_STYLE = "fill: LightGray; opacity: 60%";
const Q2_ATTRIBUTES = {
    style: "fill: #fa7576",
    width: "50%",
    height: "50%",
    x: "0%",
    y: "0%"
};
const Q1_ATTRIBUTES = {
    style: "fill: #a0d5ff",
    width: "50%",
    height: "50%",
    x: "50%",
    y: "0%"
};
const Q3_ATTRIBUTES = {
    style: "fill: #cdf6ca",
    width: "50%",
    height: "50%",
    x: "0%",
    y: "50%"
};
const Q4_ATTRIBUTES = {
    style: "fill: #e0cdf5",
    width: "50%",
    height: "50%",
    x: "50%",
    y: "50%"
};
const svgElementFactory = (name, attributes)=>{
    const element = document.createElementNS("http://www.w3.org/2000/svg", name);
    for (const [name1, value] of Object.entries(attributes)){
        element.setAttribute(name1, value);
    }
    return element;
};
class PoliticalCompass extends HTMLElement {
    #societyWeights;
    #economyWeights;
    #point;
    #confidenceRegion80;
    #confidenceRegion95;
    constructor(){
        super();
        const style = document.createElement("style");
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.appendChild(svgElementFactory("rect", Q1_ATTRIBUTES));
        svg.appendChild(svgElementFactory("rect", Q2_ATTRIBUTES));
        svg.appendChild(svgElementFactory("rect", Q3_ATTRIBUTES));
        svg.appendChild(svgElementFactory("rect", Q4_ATTRIBUTES));
        this.#confidenceRegion95 = svgElementFactory("ellipse", CONFIDENCE_REGION_95_ATTRIBUTES);
        this.#confidenceRegion95.setAttribute("style", CONFIDENCE_REGION_95_STYLE);
        this.setConfidenceRegion95();
        svg.appendChild(this.#confidenceRegion95);
        this.#confidenceRegion80 = svgElementFactory("ellipse", CONFIDENCE_REGION_80_ATTRIBUTES);
        this.#confidenceRegion80.setAttribute("style", CONFIDENCE_REGION_80_STYLE);
        this.setConfidenceRegion80();
        svg.appendChild(this.#confidenceRegion80);
        this.#point = svgElementFactory("circle", POINT_ATTRIBUTES);
        this.#point = svg.appendChild(this.#point);
        this.attachShadow({
            mode: "open"
        }).append(style, svg);
    }
    set societyWeights(societyWeights) {
        if (societyWeights) {
            console.warn("Society weights should only be set once");
        }
        this.#societyWeights = societyWeights;
    }
    set economyWeights(economyWeights) {
        if (economyWeights) {
            console.warn("Economy weights should only be set once");
        }
        this.#economyWeights = economyWeights;
    }
    setConfidenceRegion95({ cx , cy , rx , ry  } = CONFIDENCE_REGION_95_ATTRIBUTES) {
        this.#confidenceRegion95.setAttribute("cx", cx);
        this.#confidenceRegion95.setAttribute("cy", cy);
        this.#confidenceRegion95.setAttribute("rx", rx);
        this.#confidenceRegion95.setAttribute("ry", ry);
    }
    setConfidenceRegion80({ cx , cy , rx , ry  } = CONFIDENCE_REGION_80_ATTRIBUTES) {
        this.#confidenceRegion80.setAttribute("cx", cx);
        this.#confidenceRegion80.setAttribute("cy", cy);
        this.#confidenceRegion80.setAttribute("rx", rx);
        this.#confidenceRegion80.setAttribute("ry", ry);
    }
    setPoint(cx = "50%", cy = "50%") {
        this.#point.setAttribute("cx", cx);
        this.#point.setAttribute("cy", cy);
    }
    computeConfidenceRegion(texts) {
        if (!this.#societyWeights || !this.#economyWeights) {
            console.warn("One or both of the weights has not been set");
            return;
        }
        console.log(texts.length);
        if (texts.length === 0) {
            this.setConfidenceRegion80();
            this.setConfidenceRegion95();
            return;
        }
        const societyProbabilities = [];
        const economyProbabilities = [];
        for (const text of texts){
            const x = vectorize(text);
            const societyProbability = probability(x, this.#societyWeights);
            societyProbabilities.push(societyProbability);
            const economyProbability = probability(x, this.#economyWeights);
            economyProbabilities.push(economyProbability);
        }
        const societyMean = mean(societyProbabilities);
        const cx = 100 * (1 + societyMean) / 2 + "%";
        const societyMarginOfError80 = marginOfError(societyProbabilities, 0.2);
        const rx80 = (100 * societyMarginOfError80 || 1000) + "%";
        const societyMarginOfError95 = marginOfError(societyProbabilities, 0.05);
        const rx95 = (100 * societyMarginOfError95 || 1000) + "%";
        const economyMean = mean(economyProbabilities);
        const cy = 100 * (1 - economyMean) / 2 + "%";
        const economyMarginOfError80 = marginOfError(societyProbabilities, 0.2);
        const ry80 = (100 * economyMarginOfError80 || 1000) + "%";
        const economyMarginOfError95 = marginOfError(societyProbabilities, 0.05);
        const ry95 = (100 * economyMarginOfError95 || 1000) + "%";
        this.setConfidenceRegion95({
            cx,
            cy,
            rx: rx95,
            ry: ry95
        });
        this.setConfidenceRegion80({
            cx,
            cy,
            rx: rx80,
            ry: ry80
        });
        this.setPoint(cx, cy);
    }
}
customElements.define("political-compass", PoliticalCompass);
