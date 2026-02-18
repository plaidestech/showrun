# ShowRun vs. Playwright: When to Use Which?

If you're working with browser automation, you've probably heard of Playwright—the modern, powerful framework from Microsoft that's become the industry standard for testing and automation. But what if you need something more than "just" automation? What if you want **versioned, reproducible workflows** that can be packaged, distributed, and run by AI agents?

That's where ShowRun comes in.

This post compares ShowRun and Playwright to help you understand when to use each tool, how they complement one another, and what makes ShowRun unique in the browser automation landscape.

## TL;DR: When to Use Which?

| Use Case | Playwright | ShowRun |
|----------|-----------|---------|
| **End-to-end testing** | ✅ Perfect | ❌ Not designed for this |
| **One-off automation scripts** | ✅ Great | ❌ Overkill |
| **Versioned, reusable workflows** | ⚠️ Manual tracking | ✅ Built-in |
| **Distribute automation to users** | ⚠️ Complex setup | ✅ Task Packs |
| **AI agent browser tools** | ⚠️ Requires MCP wrapper | ✅ Native MCP support |
| **Anti-detection browsing** | ⚠️ Manual setup | ✅ Camoufox built-in |
| **API-first automation** | ⚠️ Manual | ✅ First-class support |
| **AI-assisted flow creation** | ❌ Not available | ✅ Teach Mode |

**Bottom line**: Use **Playwright** for testing and one-off scripts. Use **ShowRun** when you need versioned, distributable automation that works with AI agents.

## What is Playwright?

[Playwright](https://playwright.dev/) is a powerful browser automation framework that enables:
- Cross-browser testing (Chromium, Firefox, WebKit)
- Fast, reliable test execution
- Rich developer experience with auto-wait, screenshots, and traces
- Excellent documentation and ecosystem

Playwright is fantastic for what it was designed for: **testing web applications**. It's fast, reliable, and has a massive community.

**Example Playwright Test:**

````javascript
import { test, expect } from '@playwright/test';

test('extract product price', async ({ page }) => {
  await page.goto('https://example.com/product/123');
  await page.waitForSelector('.price');
  const price = await page.textContent('.price');
  console.log('Price:', price);
});
````

This works great for one-off automation! But what if you want to:
- Package this as a reusable tool for non-technical users?
- Version the workflow and track changes over time?
- Distribute it as an MCP tool for AI agents?
- Run it with anti-detection browsers to avoid blocking?

That's where ShowRun's **Task Pack** architecture shines.

## What is ShowRun?

ShowRun is a **TypeScript + Playwright framework** that adds **versioning, distribution, and AI integration** on top of browser automation.

The key concept in ShowRun is the **Task Pack**—a self-contained, versioned automation module that:
- Defines metadata (id, name, version, description)
- Declares an input schema (what parameters it needs)
- Declares a collectibles schema (what data it extracts)
- Implements a deterministic `flow` (JSON-defined steps or TypeScript code)
- Can be packaged and distributed independently

**Example ShowRun Task Pack (JSON-DSL format):**

`taskpack.json`:
````json
{
  "id": "example.product.price",
  "name": "Product Price Extractor",
  "version": "1.0.0",
  "description": "Extracts product price from e-commerce pages",
  "kind": "json-dsl"
}
````

`flow.json`:
````json
{
  "inputs": {
    "productUrl": {
      "type": "string",
      "required": true,
      "description": "URL of the product page"
    }
  },
  "collectibles": [
    {
      "name": "price",
      "type": "string",
      "description": "Product price"
    }
  ],
  "flow": [
    {
      "id": "navigate",
      "type": "navigate",
      "params": {
        "url": "{{inputs.productUrl}}",
        "waitUntil": "networkidle"
      }
    },
    {
      "id": "extract_price",
      "type": "extract_text",
      "params": {
        "target": { "kind": "css", "selector": ".price" },
        "out": "price"
      }
    }
  ]
}
````

**Run it:**
````bash
npx showrun run ./taskpacks/product-price --inputs '{"productUrl":"https://example.com/product/123"}'
````

Notice the key differences:
1. **Versioning**: The Task Pack has an explicit version number
2. **Schema**: Inputs and outputs are declared upfront
3. **Portability**: It's a directory that can be committed to git, distributed via npm, or loaded dynamically
4. **No code required**: The JSON-DSL format needs no build step

## Key Differences

### 1. Purpose and Philosophy

| **Playwright** | **ShowRun** |
|----------------|-------------|
| General-purpose browser automation | Versioned, reusable workflows |
| Testing-first design | Distribution-first design |
| Write code, run tests | Define packs, run anywhere |
| Manual versioning | Built-in versioning |

### 2. Versioning and Distribution

**Playwright**: You version your test code manually using git or package.json. Distribution requires users to install your entire repo or package.

**ShowRun**: Task Packs have version numbers in their metadata and can be distributed as standalone directories or packages. You can load multiple versions of the same pack simultaneously.

````bash
# ShowRun: Load packs from any directory
npx showrun dashboard --packs ./my-taskpacks
npx showrun dashboard --packs ~/Downloads/community-packs
````

### 3. AI Integration (MCP Support)

**Playwright**: No native AI or MCP integration. You'd need to write your own MCP server wrapper.

**ShowRun**: Ships with an **MCP server** that exposes Task Packs as tools for AI agents. Works with Claude Desktop, Cline, and any MCP-compatible client.

````bash
# Start MCP server
npx showrun serve --packs ./taskpacks --http --port 3001
````

Now any AI agent can:
- Discover available Task Packs
- Inspect their input/output schemas
- Call them as tools
- Get structured results back

### 4. Anti-Detection (Camoufox)

**Playwright**: Uses standard Chromium/Firefox. Websites can often detect automation via `navigator.webdriver`, CDP headers, and other fingerprints.

**ShowRun**: Uses **Camoufox**, an anti-detection Firefox fork. This makes ShowRun better suited for automation that needs to avoid bot detection.

````bash
# ShowRun automatically uses Camoufox
npx camoufox-js fetch  # One-time setup
npx showrun run ./taskpacks/my-pack --inputs '{}'
````

### 5. API-First Automation

**Playwright**: Automation usually relies on DOM selectors. If the website has an API, you extract it manually from DevTools.

**ShowRun**: Includes first-class support for **API-first automation**:
- Capture HTTP requests/responses during browser runs
- Generate "snapshots" of API calls
- Run Task Packs in **HTTP-only mode** (no browser, just replay captured API calls)

This approach is:
- **Faster**: API calls are 10-100x faster than browser automation
- **More reliable**: No DOM changes breaking your selectors
- **Cheaper**: Lower CPU/memory usage

````json
{
  "id": "extract_data",
  "type": "network_find",
  "params": {
    "url_pattern": "/api/products/*",
    "method": "GET",
    "out": "apiData"
  }
}
````

### 6. Teach Mode (AI-Assisted Flow Creation)

**Playwright**: You write code from scratch.

**ShowRun**: Includes **Teach Mode**, an AI-assisted dashboard that helps you create flows:
1. Start the dashboard
2. Describe what you want to do
3. The AI explores the website using a Browser Inspector MCP
4. It proposes DSL steps and adds them to your flow

````bash
npx showrun dashboard --packs ./taskpacks --headful
````

The AI doesn't run at execution time—it only helps you **build** the flow. Once built, the flow is deterministic and pure code.

### 7. Declarative DSL vs. Imperative Code

**Playwright**: Imperative code (you write TypeScript/JavaScript functions).

````javascript
// Playwright: Imperative
await page.goto('https://example.com');
await page.click('button#submit');
await page.fill('input[name="email"]', 'user@example.com');
const result = await page.textContent('.result');
````

**ShowRun**: Declarative JSON steps (no code required for most workflows).

````json
{
  "flow": [
    { "id": "1", "type": "navigate", "params": { "url": "https://example.com" } },
    { "id": "2", "type": "click", "params": { "target": { "kind": "css", "selector": "button#submit" } } },
    { "id": "3", "type": "fill", "params": { "target": { "kind": "css", "selector": "input[name='email']" }, "value": "user@example.com" } },
    { "id": "4", "type": "extract_text", "params": { "target": { "kind": "css", "selector": ".result" }, "out": "result" } }
  ]
}
````

**Why declarative?**
- **Versionable**: JSON files diff cleanly in git
- **Inspectable**: Non-developers can understand flows
- **Editable**: AI agents can modify flows by patching JSON
- **Portable**: No build step required

For complex logic, you can still write TypeScript Task Packs.

## Code Comparison: Same Task, Two Approaches

Let's automate extracting product listings from an e-commerce site.

### Playwright Approach

````javascript
import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://example.com/products');
  await page.waitForSelector('.product-card');
  
  const products = await page.$$eval('.product-card', cards =>
    cards.map(card => ({
      name: card.querySelector('.product-name')?.textContent?.trim(),
      price: card.querySelector('.product-price')?.textContent?.trim(),
    }))
  );
  
  console.log('Products:', products);
  await browser.close();
})();
````

**Pros**:
- Familiar imperative code
- Full control over execution
- Easy to debug

**Cons**:
- No versioning
- No schema declaration
- Hard to distribute
- Requires users to install Node.js + dependencies

### ShowRun Approach

`taskpack.json`:
````json
{
  "id": "example.products.list",
  "name": "Product Listings",
  "version": "1.0.0",
  "description": "Extract product listings from e-commerce site",
  "kind": "json-dsl"
}
````

`flow.json`:
````json
{
  "inputs": {
    "url": {
      "type": "string",
      "required": true,
      "description": "URL of products page"
    }
  },
  "collectibles": [
    {
      "name": "products",
      "type": "array",
      "description": "List of products"
    }
  ],
  "flow": [
    {
      "id": "navigate",
      "type": "navigate",
      "params": {
        "url": "{{inputs.url}}",
        "waitUntil": "networkidle"
      }
    },
    {
      "id": "extract_products",
      "type": "extract_list",
      "params": {
        "container": { "kind": "css", "selector": ".product-card" },
        "items": {
          "name": { "kind": "css", "selector": ".product-name" },
          "price": { "kind": "css", "selector": ".product-price" }
        },
        "out": "products"
      }
    }
  ]
}
````

**Pros**:
- Versioned (explicit version in metadata)
- Schema-declared (inputs/outputs defined)
- No build step (pure JSON)
- Distributable via git or npm
- Works with AI agents via MCP
- Can run with `npx showrun` (no local install)

**Cons**:
- Learning curve for DSL step types
- Less flexible for complex logic (though TypeScript packs are supported)

## When Should You Use ShowRun?

ShowRun is ideal when you need:

1. **Versioned workflows**: Track changes to automation over time
2. **Reusable automation**: Package flows and share them across projects or users
3. **AI agent tools**: Expose browser automation as MCP tools for Claude, Cline, etc.
4. **Anti-detection browsing**: Avoid bot detection with Camoufox
5. **API-first automation**: Capture and replay API calls for faster, more reliable flows
6. **Non-technical users**: Provide pre-built Task Packs that "just work"
7. **Git-versionable flows**: Declarative JSON flows diff cleanly in source control

## When Should You Stick with Playwright?

Use Playwright when:

1. **End-to-end testing**: Playwright's test runner is unmatched for testing
2. **One-off scripts**: Quick automation that doesn't need versioning or distribution
3. **Maximum flexibility**: You need full programmatic control
4. **Mature ecosystem**: You want battle-tested tooling and a huge community

## ShowRun is Built on Playwright

It's important to note: **ShowRun doesn't replace Playwright—it builds on it**. Under the hood, ShowRun uses Playwright for browser control. The Task Pack DSL is just a layer on top that adds:
- Versioning
- Distribution
- Schema declaration
- MCP integration
- Anti-detection
- API-first patterns

Think of ShowRun as **Playwright for automation, not testing**.

## Feature Comparison Matrix

| Feature | Playwright | ShowRun |
|---------|-----------|---------|
| **Browser Control** | ✅ Full API | ✅ Via DSL or TypeScript |
| **Test Runner** | ✅ Built-in | ❌ Not designed for testing |
| **Versioning** | ⚠️ Manual | ✅ Built-in to Task Packs |
| **Schema Declaration** | ❌ No | ✅ Inputs/Collectibles |
| **Distribution** | ⚠️ Complex | ✅ Task Packs |
| **MCP Support** | ❌ No | ✅ Native |
| **Anti-Detection** | ⚠️ Manual | ✅ Camoufox |
| **API Replay** | ❌ No | ✅ Built-in |
| **AI-Assisted Creation** | ❌ No | ✅ Teach Mode |
| **Declarative Flows** | ❌ No | ✅ JSON-DSL |
| **Headless** | ✅ Yes | ✅ Yes |
| **Screenshots/Traces** | ✅ Rich | ✅ Basic (error artifacts) |
| **Community Size** | ✅ Huge | ⚠️ New (experimental) |
| **Cross-Browser** | ✅ Chromium/Firefox/WebKit | ⚠️ Camoufox (Firefox-based) |

## Can You Use Both?

Absolutely! In fact, many workflows benefit from using **both**:

1. **Test with Playwright**: Write end-to-end tests for your web app using Playwright's test runner
2. **Automate with ShowRun**: Package reusable automation as Task Packs for AI agents or non-technical users

Example workflow:
- Your QA team uses Playwright to write and run tests
- Your sales team uses ShowRun Task Packs to automate data extraction from client sites
- Your AI agent uses ShowRun's MCP server to perform browser research

## Getting Started with ShowRun

Ready to try ShowRun? Here's the quickest way to get started:

````bash
# 1. Create a directory
mkdir my-showrun-project && cd my-showrun-project

# 2. Download Camoufox browser
npx camoufox-js fetch

# 3. Create a task pack (or use an example)
npx showrun pack create --dir ./taskpacks --id my.pack --name "My Pack"

# 4. Run it
npx showrun run ./taskpacks/my-pack --inputs '{}'

# 5. Or use the dashboard with Teach Mode
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
npx showrun dashboard --packs ./taskpacks --headful
````

Check out the [GitHub repo](https://github.com/plaidestech/showrun) for more examples and documentation.

## Conclusion

Playwright and ShowRun serve different purposes:

- **Playwright** is the best tool for **testing and one-off automation**
- **ShowRun** is designed for **versioned, distributable workflows** that work with AI agents

If you're building browser automation that needs to be packaged, versioned, and distributed—especially to AI agents via MCP—ShowRun is worth exploring.

The two tools complement each other beautifully. Playwright handles the heavy lifting of browser control, while ShowRun adds the structure, versioning, and AI integration that modern automation workflows need.

**What's your use case? Have you tried ShowRun? Let me know in the comments or open an issue on [GitHub](https://github.com/plaidestech/showrun)!**

---

*ShowRun is an experimental project in active development. APIs and file formats may change. Check the [GitHub repository](https://github.com/plaidestech/showrun) for the latest updates.*
