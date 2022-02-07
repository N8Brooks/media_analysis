const politicalCompass = document.querySelector("political-compass");

// TODO: the weights are fetched per call

fetch("society_model.bin")
  .then((response) => response.arrayBuffer())
  .then((array) => {
    politicalCompass.societyWeights = new Float32Array(array);
  });

fetch("economy_model.bin")
  .then((response) => response.arrayBuffer())
  .then((array) => {
    politicalCompass.economyWeights = new Float32Array(array);
  });

/** Sample page for texts */
const parseTexts = () => {
  const articles = [...document.querySelectorAll("article")];
  if (!articles.length) {
    articles.push(document.body);
  }
  return articles
    .flatMap((article) => article.innerText?.split("\n\n"))
    .filter((p) => p && p.length >= 128)
    .filter((p) => p.split(".").length > p.split("\n").length);
};

const main = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: parseTexts,
  }, (results) => {
    const texts = results[0].result;
    politicalCompass.computeConfidenceRegion(texts);
  });
};

main();
