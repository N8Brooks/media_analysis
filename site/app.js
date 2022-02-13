/** Used for accessing cache storage api */
const CACHE_NAME = "political-compass-0";

// Grab custom html element
const politicalCompass = document.querySelector("political-compass");

// Fetch society weights
fetch("../models/society_model.bin")
  .then((response) => response.arrayBuffer())
  .then((array) => {
    const intervalId = setInterval(() => {
      if (!customElements.get("political-compass")) {
        return;
      }
      const societyWeights = new Float32Array(array);
      politicalCompass.societyWeights = societyWeights;
      console.debug(`Loaded society weights length ${societyWeights.length}`);
      clearInterval(intervalId);
    }, 50);
  });

// Fetch economy weights
fetch("../models/economy_model.bin")
  .then((response) => response.arrayBuffer())
  .then((array) => {
    const intervalId = setInterval(() => {
      if (!customElements.get("political-compass")) {
        return;
      }
      const economyWeights = new Float32Array(array);
      politicalCompass.economyWeights = economyWeights;
      console.debug(`Loaded economy weights length ${economyWeights.length}`);
      clearInterval(intervalId);
    }, 50);
  });

// Add event listener for when text is submitted
const politicalText = document.querySelector("textarea");
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  const texts = politicalText.value.split("\n\n");
  politicalCompass.computeConfidenceRegion(texts);
});

// Add listener for weight updates
politicalCompass.addEventListener("weightsupdate", async (event) => {
  console.debug("Received weightsupdate event");
  const cache = await caches.open(CACHE_NAME);
  const societyResponse = new Response(event.detail.societyWeights);
  cache.put("../models/society_model.bin", societyResponse);
  const economyResponse = new Response(event.detail.economyWeights);
  cache.put("../models/economy_model.bin", economyResponse);
});

// Register service worker
navigator.serviceWorker.register(`service_worker.js?cache-name=${CACHE_NAME}`);
