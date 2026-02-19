# Form Automation Demo

## Overview

This task pack demonstrates **comprehensive form automation** including text input, dropdowns, checkboxes, and form submission. It uses Playwright's demo page which is designed for testing automation.

## Features

- ✅ Text field filling
- ✅ Dropdown selection
- ✅ Checkbox interaction
- ✅ Form submission
- ✅ Success confirmation extraction
- ✅ Variable handling and defaults

## Use Case

Automate multi-step form filling workflows, which is common in:
- Account registration
- Survey completion
- Data entry tasks
- Application submissions

## Inputs

| Parameter   | Type   | Required | Description                          |
|-------------|--------|----------|--------------------------------------|
| `full_name` | string | Yes      | Full name to enter in form           |
| `email`     | string | Yes      | Email address                        |
| `country`   | string | No       | Country selection (default: 'United States') |

## Collectibles

| Field             | Type   | Description                           |
|-------------------|--------|---------------------------------------|
| `success_message` | string | Confirmation message after submission |
| `form_url`        | string | URL after form submission             |

## Example Usage

```bash
# Minimal inputs (using default country)
showrun run ./taskpacks/form-automation --inputs '{"full_name":"John Doe","email":"john@example.com"}'

# With custom country
showrun run ./taskpacks/form-automation --inputs '{"full_name":"Jane Smith","email":"jane@example.com","country":"Canada"}'

# Expected output:
# {
#   "success_message": "Form submitted successfully!",
#   "form_url": "https://demo.playwright.dev/demo.html?submitted=true"
# }
```

## How It Works

1. **Set Variable**: Sets default country if not provided
2. **Navigate**: Opens the demo form page
3. **Fill Fields**: Enters name and email
4. **Select Dropdown**: Chooses country from dropdown
5. **Click Checkbox**: Subscribes to newsletter
6. **Submit**: Clicks the submit button
7. **Confirm**: Waits for and extracts success message

## Test Environment

This pack uses `demo.playwright.dev`, which is:
- An official Playwright test page
- Designed for automation testing
- Free and publicly accessible
- Stable and reliable

## Key DSL Steps Used

- `set_var` - Set runtime variables with defaults
- `navigate` - Load the page
- `fill` - Enter text into input fields
- `select_option` - Choose from dropdown menus
- `click` - Click buttons and checkboxes
- `wait_for` - Wait for elements to appear
- `extract_text` - Extract confirmation data
