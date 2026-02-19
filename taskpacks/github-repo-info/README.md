# GitHub Repository Info Collector

## Overview

This task pack demonstrates the **API-first approach** in ShowRun. Instead of scraping HTML elements, it captures GitHub's API responses during page navigation and extracts structured data using JMESPath queries.

## Features

- ✅ API-first data extraction (no DOM scraping)
- ✅ JMESPath queries for complex data transformations
- ✅ Network request interception
- ✅ Structured, reliable data extraction

## Use Case

Collect metadata about any public GitHub repository, including stars, forks, topics, and language information.

## Inputs

| Parameter | Type   | Required | Description                              |
|-----------|--------|----------|------------------------------------------|
| `owner`   | string | Yes      | GitHub repository owner or organization  |
| `repo`    | string | Yes      | GitHub repository name                   |

## Collectibles

| Field         | Type   | Description                           |
|---------------|--------|---------------------------------------|
| `repo_name`   | string | Full repository name (owner/repo)     |
| `description` | string | Repository description                |
| `stars`       | number | Number of stars                       |
| `forks`       | number | Number of forks                       |
| `language`    | string | Primary programming language          |
| `topics`      | string | Repository topics (comma-separated)   |

## Example Usage

```bash
# Using the CLI
showrun run ./taskpacks/github-repo-info --inputs '{"owner":"microsoft","repo":"playwright"}'

# Expected output collectibles:
# {
#   "repo_name": "microsoft/playwright",
#   "description": "Playwright is a framework for Web Testing and Automation...",
#   "stars": 65432,
#   "forks": 3567,
#   "language": "TypeScript",
#   "topics": "testing,automation,playwright,browser"
# }
```

## How It Works

1. **Navigate**: Opens the GitHub repository page
2. **Network Intercept**: Captures API responses matching `api.github.com/repos/`
3. **Extract Data**: Uses JMESPath to extract specific fields from the JSON response
4. **Return Results**: Outputs structured collectibles

## Why API-First?

API-first automation is more reliable than DOM scraping because:
- APIs have stable, versioned contracts
- Less brittle than CSS selectors
- Returns structured JSON data
- Often faster (no need to parse HTML)

## Key DSL Steps Used

- `navigate` - Load the page and trigger API calls
- `network_find` - Capture API response by URL pattern
- `network_extract` - Extract data using JMESPath from captured response
