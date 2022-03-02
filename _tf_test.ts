import * as tf from "https://cdn.skypack.dev/@tensorflow/tfjs-core?dts";
import "https://cdn.skypack.dev/@tensorflow/tfjs-backend-cpu?dts";
import * as use from "https://cdn.skypack.dev/@tensorflow-models/universal-sentence-encoder?dts";

// await tf.ready();
await tf.setBackend("cpu");
const platform = {
  textEncoder: new TextEncoder(),
  fetch,
  now: performance.now,
  encode: new TextEncoder().encode,
  decode(bytes: Uint8Array, encoding: string): string {
    return new TextDecoder(encoding).decode(bytes);
  },
};

tf.ENV.setPlatform("deno", platform);

const model = await use.load();

console.time();
console.log(await model.embed("hi there"));
console.timeEnd();
