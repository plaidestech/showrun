# HackerNews Top Stories Collector

## Overview

This task pack demonstrates **hybrid data extraction** from Hacker News, combining DOM selectors with JavaScript expressions. It shows how to extract list items, attributes, and computed values.

## Features

- ✅ DOM element selection
- ✅ Attribute extraction (href)
- ✅ JavaScript expression evaluation
- ✅ List item handling
- ✅ Adjacent element selection (CSS siblings)

## Use Case

Monitor trending topics on Hacker News, track top stories, or collect links for further processing or analysis.

## Inputs

| Parameter     | Type   | Required | Description                                  |
|---------------|--------|----------|----------------------------------------------|
| `max_stories` | number | No       | Maximum stories to collect (default: 10)     |

## Collectibles

| Field                | Type   | Description                       |
|----------------------|--------|-----------------------------------|
| `story_count`        | number | Number of visible stories         |
| `first_story_title`  | string | Title of the top story            |
| `first_story_url`    | string | URL of the top story              |
| `first_story_points` | string | Points/score of the top story     |

## Example Usage

```bash
# Get top stories
showrun run ./taskpacks/hackernews-stories --inputs '{}'

# Expected output:
# {
#   "story_count": 30,
#   "first_story_title": "Show HN: I built a thing...",
#   "first_story_url": "https://example.com/project",
#   "first_story_points": "234 points"
# }
```

## How It Works

1. **Navigate**: Opens Hacker News homepage
2. **Wait**: Ensures story list is loaded
3. **Count**: Uses JavaScript to count total stories
4. **Extract**: Pulls title, URL, and points from first story
5. **Return**: Outputs structured data

## Public Data Source

Hacker News is:
- A public news aggregator
- Open to automated access
- Community-driven content
- No authentication required for reading

## Key DSL Steps Used

- `navigate` - Load the page
- `wait_for` - Wait for content to load
- `extract_text` - Extract text content
- `extract_attribute` - Extract element attributes (href, src, etc.)
- JavaScript expressions via `target.kind: 'js'` for complex queries

## Advanced Patterns

This pack demonstrates:
- **CSS sibling selectors** (`.athing:first-child + tr`) to navigate between related elements
- **JavaScript evaluation** for dynamic data like counting elements
- **Attribute extraction** to get href values without text content
