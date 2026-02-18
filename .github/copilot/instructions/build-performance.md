# Build Performance Engineering

**Quick measurement:** Track full and incremental builds with `time pnpm build`. Baseline: ~30-60s full build.

**Key bottlenecks:**
- Sequential TypeScript compilation across 7 packages (`pnpm -r --filter=!showrun build`)
- Dashboard Vite build includes TypeScript + React bundle generation
- No build caching between runs

**Optimization approaches:**
- Enable parallel builds: Remove `--filter=!showrun` constraint if dependency order allows
- Use TypeScript project references for incremental compilation
- Cache `node_modules/.cache` and `dist/` directories in CI
- Profile slow packages: `tsc --diagnostics` to identify compilation hotspots

**Measurement strategy:**
- `time pnpm build` for full build (clean `dist/` first)
- `time pnpm -r --filter=@showrun/core build` for single package
- Track per-package times: `for pkg in packages/*; do time pnpm --filter=$pkg build; done`

**Success criteria:** Full build <30s, incremental rebuild <5s for typical single-file changes.
