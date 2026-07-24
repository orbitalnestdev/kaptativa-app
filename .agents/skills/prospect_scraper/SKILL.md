# Prospect Scraper Skill

This skill allows the Kaptativa AI agent to scrape real estate agencies and other businesses from OpenStreetMap (Overpass API) or other public databases, filtering for businesses without a website, and importing them into the CRM.

## Usage

Run the scraper script using the command:
```bash
node .agents/skills/prospect_scraper/scripts/scraper.js --country AR --limit 10
```

### Options
* `--country`: ISO country code (e.g. `AR` for Argentina, `PE` for Peru). Default: `AR`.
* `--limit`: Number of prospects to extract. Default: `10`.
* `--output`: Filename to save the scraped JSON. Default: `scraped_prospects.json`.
