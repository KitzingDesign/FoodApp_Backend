const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Extract JSON-LD data from HTML
 * @param {string} html - The HTML content
 * @returns {object|null} - JSON-LD object or null if not found
 */
function extractJsonLD(html) {
  const $ = cheerio.load(html);
  const scripts = $('script[type="application/ld+json"]');
  let jsonLd = null;

  scripts.each((_, element) => {
    const scriptContent = $(element).html();
    try {
      const parsed = JSON.parse(scriptContent);

      // Log all parsed JSON-LD for debugging
      console.log("Found JSON-LD data:", parsed);

      // Handle arrays and objects with multiple @types
      if (Array.isArray(parsed)) {
        const recipe = parsed.find((item) =>
          Array.isArray(item["@type"])
            ? item["@type"].includes("Recipe")
            : item["@type"] === "Recipe"
        );
        if (recipe) {
          jsonLd = recipe;
          return false; // Break the loop
        }
      } else if (
        Array.isArray(parsed["@type"]) &&
        parsed["@type"].includes("Recipe")
      ) {
        jsonLd = parsed;
        return false; // Break the loop
      } else if (parsed["@type"] === "Recipe") {
        jsonLd = parsed;
        return false; // Break the loop
      }
    } catch (error) {
      console.error("Error parsing JSON-LD script:", error);
    }
  });

  return jsonLd;
}

/**
 * Parse recipe data from JSON-LD
 * @param {object} jsonLd - JSON-LD data
 * @returns {object} - Recipe details
 */
function parseRecipeFromJsonLd(jsonLd) {
  if (!jsonLd) {
    throw new Error("No recipe data found in JSON-LD.");
  }

  return {
    name: jsonLd.name || "",
    description: jsonLd.description || "No description provided",
    ingredients: jsonLd.recipeIngredient || [],
    instructions: jsonLd.recipeInstructions
      ? jsonLd.recipeInstructions.map((step) =>
          typeof step === "string" ? step : step.text
        )
      : [],
    prepTime: jsonLd.prepTime || "",
    cookTime: jsonLd.cookTime || "",
    totalTime: jsonLd.totalTime || "",
    servings: jsonLd.recipeYield || "", // Extract servings
    image: jsonLd.image || "", // Extract image
    nutrition: jsonLd.nutrition || {},
  };
}

/**
 * Fetch HTML using axios
 * @param {string} url - URL to fetch
 * @returns {string} - HTML content
 */
async function fetchHtml(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch HTML: ${error.message}`);
  }
}

/**
 * Scrape a recipe from a URL
 * @param {string} url - Recipe page URL
 * @returns {object} - Scraped recipe data
 */
async function scrapeRecipe(url) {
  try {
    console.log(`Fetching HTML for: ${url}`);
    const html = await fetchHtml(url);

    console.log("Extracting JSON-LD data...");
    const jsonLdData = extractJsonLD(html);

    console.log("Parsing recipe data...");
    const recipeData = parseRecipeFromJsonLd(jsonLdData);

    console.log("Recipe scraped successfully!");
    return recipeData;
  } catch (error) {
    console.error("Error scraping recipe:", error.message);
    throw error;
  }
}

module.exports = { scrapeRecipe };
