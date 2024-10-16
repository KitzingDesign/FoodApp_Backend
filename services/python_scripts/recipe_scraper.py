# recipe_scraper.py

import sys
import json
import requests
from recipe_scrapers import scrape_html

def main(url, name):
    # Send a GET request to the URL with a custom User-Agent
    headers = {"User-Agent": f"Burger Seeker {name}"}
    response = requests.get(url, headers=headers)
    
    # Check if the request was successful
    if response.status_code == 200:
        html = response.content
        scraper = scrape_html(html, org_url=url)

        # Prepare the scraped data
        recipe_data = {
            "title": scraper.title(),
            "ingredients": scraper.ingredients(),
            "instructions": scraper.instructions()
        }

        # Return the data as JSON
        return json.dumps(recipe_data)
    else:
        return json.dumps({"error": f"Failed to retrieve recipe. Status code: {response.status_code}"})

if __name__ == "__main__":
    # Expect URL and name as command line arguments
    url = sys.argv[1]
    name = sys.argv[2]
    result = main(url, name)
    print(result)  # Print the result when running as a script
