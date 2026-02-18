# Task Pack Runtime Performance

**Quick measurement:** Add timing logs in DSL interpreter or use Playwright tracing.

**Key bottlenecks:**
- Playwright browser launch/teardown overhead
- Selector wait timeouts (default 30s per step)
- Network requests during navigation and interactions
- Screenshot/artifact generation on errors

**Optimization approaches:**
- Browser session reuse: Keep browser context alive across runs for sequential executions
- Selector optimization: Use efficient locators (data-testid, role) over CSS/XPath traversal
- Parallel step execution: Identify independent steps that can run concurrently
- Conditional tracing: Only enable when debugging, not in production runs

**Measurement strategy:**
- Baseline: `time pnpm test:example` for simple task pack
- Playwright tracing: `--trace on` generates timeline with step durations
- Custom instrumentation: Log timestamps in `interpreter.ts` for each step type
- Profile hot paths: Node.js `--inspect` to identify CPU-bound operations

**Success criteria:** 20% reduction in task pack execution time without sacrificing reliability.
