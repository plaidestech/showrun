# Weather Forecast Checker

## Overview

This task pack demonstrates **DOM-based data extraction** from weather.gov, a public weather service that allows automated access. It shows how to extract multiple text fields from different CSS selectors.

## Features

- ✅ DOM-based text extraction
- ✅ Multiple CSS selectors
- ✅ Wait conditions for dynamic content
- ✅ Clean, structured output

## Use Case

Get current weather conditions and forecast for any location specified by latitude/longitude coordinates.

## Inputs

| Parameter   | Type   | Required | Description                           |
|-------------|--------|----------|---------------------------------------|
| `latitude`  | string | Yes      | Latitude coordinate (e.g., '40.7128') |
| `longitude` | string | Yes      | Longitude coordinate (e.g., '-74.0060')|

## Collectibles

| Field                | Type   | Description                    |
|----------------------|--------|--------------------------------|
| `location`           | string | Location name                  |
| `current_conditions` | string | Current weather conditions     |
| `temperature`        | string | Current temperature            |
| `forecast_today`     | string | Detailed forecast for today    |

## Example Usage

```bash
# New York City coordinates
showrun run ./taskpacks/weather-forecast --inputs '{"latitude":"40.7128","longitude":"-74.0060"}'

# San Francisco coordinates
showrun run ./taskpacks/weather-forecast --inputs '{"latitude":"37.7749","longitude":"-122.4194"}'

# Expected output:
# {
#   "location": "New York NY",
#   "current_conditions": "Partly Cloudy",
#   "temperature": "52°F",
#   "forecast_today": "Partly cloudy, with a high near 58..."
# }
```

## How It Works

1. **Navigate**: Opens weather.gov with lat/lon parameters
2. **Wait**: Ensures the location heading is visible
3. **Extract**: Pulls text from multiple CSS selectors
4. **Return**: Outputs weather data as collectibles

## Public Data Source

This pack uses weather.gov, which is:
- A public U.S. government website
- Free to use without authentication
- Designed for automated access
- Provides reliable weather data

## Key DSL Steps Used

- `navigate` - Load the weather page with coordinates
- `wait_for` - Wait for dynamic content to load
- `extract_text` - Extract text from CSS selectors
