const https = require("https");
const cheerio = require("cheerio");

// Function to extract JSON-LD data from the HTML
function extractJsonLD(html) {
  const $ = cheerio.load(html);
  const jsonLdScript = $('script[type="application/ld+json"]').html();
  if (jsonLdScript) {
    try {
      const jsonData = JSON.parse(jsonLdScript);
      return jsonData;
    } catch (error) {
      console.error("Error parsing JSON-LD:", error);
      return null;
    }
  }
  return null;
}

// Function to scrape the recipe from a URL
function scrapeRecipe(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          const jsonLdData = extractJsonLD(data);
          if (jsonLdData) {
            if (
              jsonLdData["@type"] === "Recipe" ||
              (Array.isArray(jsonLdData) &&
                jsonLdData.some((item) => item["@type"] === "Recipe"))
            ) {
              const recipe = Array.isArray(jsonLdData)
                ? jsonLdData.find((item) => item["@type"] === "Recipe")
                : jsonLdData;
              resolve(recipe);
            } else {
              reject("No recipe found in JSON-LD.");
            }
          } else {
            reject("No JSON-LD found on the page.");
          }
        });
      })
      .on("error", (error) => {
        reject(`Error fetching the recipe: ${error.message}`);
      });
  });
}

module.exports = { scrapeRecipe };
