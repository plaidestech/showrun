# Multi-Tab Navigation Demo

## Overview

This task pack demonstrates **multi-tab browser automation**, showing how to open new tabs, switch between them, and collect data from multiple pages simultaneously.

## Features

- ✅ Opening new browser tabs
- ✅ Switching between tabs
- ✅ Tab handle management
- ✅ Parallel page data collection
- ✅ Default URL handling

## Use Case

Useful for workflows that require:
- Comparing data across multiple pages
- Collecting information from several sources
- Managing multiple login sessions
- Parallel page monitoring

## Inputs

| Parameter | Type   | Required | Description                                |
|-----------|--------|----------|--------------------------------------------|
| `url_1`   | string | No       | First URL (default: https://example.com)   |
| `url_2`   | string | No       | Second URL (default: https://en.wikipedia.org) |

## Collectibles

| Field         | Type   | Description                |
|---------------|--------|----------------------------|
| `tab1_title`  | string | Title from first tab       |
| `tab2_title`  | string | Title from second tab      |
| `tab_count`   | string | Total number of tabs       |

## Example Usage

```bash
# Using defaults
showrun run ./taskpacks/multi-tab-demo --inputs '{}'

# Custom URLs
showrun run ./taskpacks/multi-tab-demo --inputs '{"url_1":"https://github.com","url_2":"https://stackoverflow.com"}'

# Expected output:
# {
#   "tab1_title": "Example Domain",
#   "tab2_title": "Wikipedia, the free encyclopedia",
#   "tab_count": "2"
# }
```

## How It Works

1. **Set Variables**: Establishes default URLs if not provided
2. **Navigate Tab 1**: Opens first URL in initial tab
3. **Extract Tab 1**: Collects title from first page
4. **Open New Tab**: Creates a second browser tab
5. **Switch Tabs**: Changes focus to the new tab
6. **Navigate Tab 2**: Opens second URL in new tab
7. **Extract Tab 2**: Collects title from second page
8. **Count**: Reports total tabs opened

## Tab Management

Key concepts:
- Each tab has a unique **handle** (identifier)
- Store handles in variables to switch between tabs
- The `new_tab` step returns a handle
- Use `switch_tab` with the handle to change focus

## Key DSL Steps Used

- `set_var` - Store default values and tab handles
- `navigate` - Load pages in each tab
- `new_tab` - Open a new browser tab (returns handle)
- `switch_tab` - Switch focus to a different tab
- `extract_title` - Get page titles
- `sleep` - Wait for pages to settle

## Advanced Use Cases

This pattern enables:
- **Cross-site comparison**: Compare prices, data, or content across sites
- **Multi-step workflows**: Login to one site, use data in another
- **Parallel monitoring**: Watch multiple pages for changes
- **Session management**: Maintain different authenticated sessions
