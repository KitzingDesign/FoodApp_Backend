const https = require("https");
const cheerio = require("cheerio");

// Fallback scraping function for ingredients and instructions in raw HTML
function scrapeRecipeHTML(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          const $ = cheerio.load(data);

          const ingredients = [];
          $(".ingredients-section li").each((i, el) => {
            ingredients.push($(el).text().trim());
          });

          const instructions = [];
          $(".instructions-section p").each((i, el) => {
            instructions.push($(el).text().trim());
          });

          resolve({
            ingredients,
            instructions,
          });
        });
      })
      .on("error", (error) =>
        reject(new Error(`Request failed: ${error.message}`))
      );
  });
}

module.exports = { scrapeRecipeHTML };
