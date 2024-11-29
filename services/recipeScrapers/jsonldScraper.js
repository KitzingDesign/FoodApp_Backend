const https = require("https");
const cheerio = require("cheerio");

// Function to extract JSON-LD data from HTML
function extractJsonLD(html) {
  const $ = cheerio.load(html);
  const scripts = $('script[type="application/ld+json"]');
  const jsonDataArray = [];

  scripts.each((_, script) => {
    try {
      const jsonData = JSON.parse($(script).html());
      if (Array.isArray(jsonData)) {
        jsonDataArray.push(...jsonData);
      } else if (jsonData["@graph"]) {
        jsonDataArray.push(...jsonData["@graph"]);
      } else {
        jsonDataArray.push(jsonData);
      }
    } catch (error) {
      console.error("Error parsing JSON-LD:", error);
    }
  });

  return jsonDataArray;
}

// Function to extract recipe data from JSON-LD
function extractRecipeData(jsonLdItem) {
  if (!jsonLdItem || jsonLdItem["@type"] !== "Recipe") return null;

  return {
    name: jsonLdItem.name,
    ingredients: jsonLdItem.recipeIngredient || [],
    instructions: jsonLdItem.recipeInstructions || [],
    prepTime: jsonLdItem.prepTime,
    cookTime: jsonLdItem.cookTime,
    totalTime: jsonLdItem.totalTime,
    image: jsonLdItem.image,
    description: jsonLdItem.description,
  };
}

// Scraping function to get recipe data from JSON-LD
function scrapeRecipe(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const jsonLdData = extractJsonLD(data);
            const recipe = jsonLdData
              .map(extractRecipeData)
              .find((item) => item !== null);

            if (recipe) {
              resolve(recipe);
            } else {
              reject(new Error("No recipe found."));
            }
          } catch (error) {
            reject(new Error(`Error fetching recipe: ${error.message}`));
          }
        });
      })
      .on("error", (error) =>
        reject(new Error(`Request failed: ${error.message}`))
      );
  });
}

module.exports = { scrapeRecipe };
