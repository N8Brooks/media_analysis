// Grab custom html element
const politicalCompass = document.querySelector("political-compass");

// Fetch society weights
fetch("models/society_model.bin.gz")
  .then((response) => response.blob())
  .then((blob) => {
    const ds = new DecompressionStream("gzip");
    const decompressionStream = blob.stream().pipeThrough(ds);
    return new Response(decompressionStream);
  })
  .then((response) => response.arrayBuffer())
  .then((array) => {
    const intervalId = setInterval(() => {
      if (!customElements.get("political-compass")) {
        return;
      }
      politicalCompass.societyWeights = new Float32Array(array);
      clearInterval(intervalId);
    }, 50);
  });

// Fetch economy weights
fetch("models/economy_model.bin.gz")
  .then((response) => response.blob())
  .then((blob) => {
    const ds = new DecompressionStream("gzip");
    const decompressionStream = blob.stream().pipeThrough(ds);
    return new Response(decompressionStream);
  })
  .then((response) => response.arrayBuffer())
  .then((array) => {
    const intervalId = setInterval(() => {
      if (!customElements.get("political-compass")) {
        return;
      }
      politicalCompass.economyWeights = new Float32Array(array);
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

// Register service worker
navigator.serviceWorker.register("service_worker.js");
